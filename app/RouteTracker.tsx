'use client';

import { useEffect } from 'react';
import { usePathname} from "next/navigation";
import Cookies from "js-cookie";

// Track navigation state and provide breadcrum trail
export default function RouteTracker() {
    const pathname = usePathname();

    useEffect(() => {
        if (!pathname) return;

        Cookies.set("currentPage", pathname, {expires: 30})
    }, [pathname]);

    return null;
}