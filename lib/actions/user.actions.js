"use server";

import { Query, ID } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite/index";
import { appwriteConfig } from "@/lib/appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])]
    );

    return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error, message) => {
    throw error;
};

export const sendEmailOTP = async (email) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);

        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send OTP");
    }
};

export const createAccount = async ({ fullName, email }) => {
    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            throw new Error("User already exists. Please sign in.");
        }
        const accountId = await sendEmailOTP(email);
        console.log(accountId);

        if (!accountId) {
            throw new Error("Failed to send an OTP");
        }

        if (!existingUser) {
            const { databases } = await createAdminClient();

            const user = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.usersCollectionId,
                ID.unique(),
                {
                    fullName,
                    email,
                    avatar: "",
                    accountId,
                }
            );
        }

        return accountId;
    } catch (error) {
        handleError(error, "Account creation failed");
    }
};

export const verifySecret = async ({ accountId, password }) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createSession(accountId, password);
        console.log(session);
        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return { sessionId: session.$id };
    } catch (error) {
        handleError(error, "failed to vereify OTP");
    }
};

export const getCurrentUser = async () => {
    try {
        const { databases, account } = await createSessionClient();

        const result = await account.get();

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)]
        );

        if (user.total <= 0) return null;

        return user.documents[0];
    } catch (error) {
        console.log(error);
    }
};

export const signOutUser = async () => {
    const { account } = await createSessionClient();

    try {
        await account.deleteSession("current");
        (await cookies()).delete("appwrite-session");
    } catch (error) {
        handleError(error, "failed to sign out user");
    } finally {
        redirect("/sign-in");
    }
};

export const signInUser = async ({ email }) => {
    try {
        const existingUser = await getUserByEmail(email);
        console.log("Existing user:", existingUser);

        if (existingUser) {
            const otpResult = await sendEmailOTP(email);
            console.log("OTP sent result:", otpResult);
            return { accountId: existingUser.accountId };
        }

        return { accountId: null };
    } catch (error) {
        console.error("Error in signInUser:", error);
        handleError(error, "Failed to sign in user");
    }
};
