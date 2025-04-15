import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

const layout = async ({ children }) => {
    const currentUser = await getCurrentUser();
    if (!currentUser) return redirect("/sign-up");

    return (
        <main className="flex h-screen">
            <Sidebar {...currentUser} />
            <section className="flex h-full flex-1 flex-col">
                <MobileNavigation {...currentUser} />
                <Header
                    userId={currentUser.$id}
                    accountId={currentUser.accountId}
                />
                <div className="main-content remove-scrollbar">{children}</div>
            </section>

            <Toaster />
        </main>
    );
};

export default layout;
