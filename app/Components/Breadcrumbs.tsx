"use client"

import {useEffect, useState} from "react";
import Link from "next/link";
import { usePathname} from "next/navigation";
import Cookies from "js-cookie";

function toLabel(segment: string) {
    // Some regex in here to try to clean up any nasty url features
    // Clean formatting too innit
    const clean = decodeURIComponent(segment).replace(/-/g, "");
    return clean.replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function Breadcrumbs() {
    const livePath = usePathname();
    const [path, setPath] = useState<string>("");

    useEffect(() => {
        const fromCookie = Cookies.get("currentPage");
        setPath(fromCookie || livePath || "/");
    }, [livePath]);

    const parts = (path || "/").split("/").filter(Boolean);
    let acc = "";
    const crumbs = parts.map((part, idx) => {
        acc += `/${part}`;
        return { name: toLabel(part), href: acc, last: idx === parts.length - 1 };
    });

    /******* PRESENTATION LOGIC *******/
    return (
        <nav aria-label="Breadcrumb" style={{fontSize: "0.9rem"}}>
            <span>
                <Link href="/" style={{color: "var(--accent)", textDecoration: "none"}}>
                    Home
                </Link>
            </span>
            {crumbs.length > 0 && <span style={{ color: "var(--muted-text)" }}> / </span>}
            {crumbs.map((c, i) => (
                <span key={c.href}>
                    {c.last ? (
                        <span style={{ color: "var(--text-primary)" }}>{c.name}</span>
                    ) : (
                    <Link href={c.href} style={{ color: "var(--accent)", textDecoration: "none" }}>
                        {c.name}
                    </Link>
                    )}
                    {i < crumbs.length - 1 && <span style={{ color: "var(--muted-text)" }}> / </span>}
                </span>
            ))}
        </nav>
    );
}