"use client";

import { navItems } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = ({ fullName, email, avatar }) => {
    const pathname = usePathname();

    return (
        <aside className="sidebar remove-scrollbar">
            <Link href="/">
                <h1 className="h1 text-brand hidden lg:block">DriveX</h1>

                <Image
                    src="/assets/icons/logo-brand.svg"
                    alt="logo"
                    width={52}
                    height={52}
                    className="lg:hidden"
                />
            </Link>

            <nav className="sidebar-nav">
                <ul className="flex flex-1 flex-col gap-2">
                    {navItems.map(({ name, icon, url }) => (
                        <Link key={name} href={url} className="lg:w-full">
                            <li
                                className={cn(
                                    "sidebar-nav-item",
                                    pathname === url && "shad-active"
                                )}>
                                <Image
                                    src={icon}
                                    alt={name}
                                    width={24}
                                    height={24}
                                    className={cn(
                                        "nav-icon",
                                        pathname === url && "nav-icon-active"
                                    )}
                                />
                                <p className="hidden lg:block">{name}</p>
                            </li>
                        </Link>
                    ))}
                </ul>
            </nav>

            <Image
                src="/assets/images/files-2.png"
                alt="logo"
                width={526}
                height={438}
                className="w-full"
            />
            <div className="sidebar-user-info">
                <Image
                    src="/assets/images/avatar.png"
                    alt="Avatar"
                    width={44}
                    height={44}
                    className="sidebar-user-avatar"
                />

                <div className="hidden lg:block ">
                    <p className="subtitle-2 capitalize">{fullName}</p>
                    <p className="subtitle-2 truncate text-ellipsis">{email}</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
