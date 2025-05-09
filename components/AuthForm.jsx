"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import OTPModal from "./OTPModal";

const authFormSchema = (formType) => {
    return z.object({
        email: z.string().email(),
        fullName:
            formType === "sign-up"
                ? z.string().min(2).max(50)
                : z.string().optional(),
    });
};

const AuthForm = ({ type }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [accountId, setAccountId] = useState(null);

    const formSchema = authFormSchema(type);
    // 1. Properly define your form
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            email: "",
        },
    });

    // 2. Define a submit handler
    const onSubmit = async (values) => {
        console.log(values);
        setIsLoading(true);
        setErrorMessage("");

        try {
            const user =
                type === "sign-up"
                    ? await createAccount({
                          fullName: values.fullName || "",
                          email: values.email,
                      })
                    : await signInUser({ email: values.email });
            console.log(user);
            if (user && user.accountId) {
                setAccountId(user.accountId);
            }
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="auth-form">
                    <h1 className="form-title">
                        {type === "sign-in" ? "Sign In" : "Sign Up"}
                    </h1>
                    {type === "sign-up" && (
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="shad-form-item">
                                        <FormLabel className="shad-form-label">
                                            Full Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                className="shad-input"
                                                placeholder="Enter Your full name"
                                                {...field}
                                            />
                                        </FormControl>
                                    </div>

                                    <FormMessage className="shad-form-message" />
                                </FormItem>
                            )}
                        />
                    )}

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="shad-form-item">
                                    <FormLabel className="shad-form-label">
                                        Email
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            className="shad-input"
                                            placeholder="Enter your email"
                                            {...field}
                                        />
                                    </FormControl>
                                </div>

                                <FormMessage className="shad-form-message" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="form-submit-button"
                        disabled={isLoading}>
                        {type === "sign-in" ? "Sign In" : "Sign Up"}
                        {isLoading && (
                            <Image
                                src="/assets/icons/loader.svg"
                                alt="loader"
                                width={24}
                                height={24}
                                className="ml-2 animate-spin"
                            />
                        )}
                    </Button>

                    {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                    )}

                    <div className="body-2 flex justify-center">
                        <p className="text-light-100">
                            {type === "sign-in"
                                ? "Dont have an account"
                                : "Already have an account"}
                        </p>
                        <Link
                            href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                            className="ml-1 font-medium text-brand">
                            {type === "sign-in" ? "Sign Up" : "Sign In"}
                        </Link>
                    </div>
                </form>
            </Form>

            {accountId && (
                <OTPModal
                    email={form.getValues("email")}
                    accountId={accountId}
                />
            )}
        </>
    );
};

export default AuthForm;
