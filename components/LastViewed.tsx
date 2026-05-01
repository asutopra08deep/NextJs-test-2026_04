// components/LastViewed.tsx
"use client";

import { useEffect, useState } from "react";

export default function LastViewed({ currentId }: { currentId: string }) {
    const [lastViewed, setLastViewed] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("lastViewedEmployee");
        setLastViewed(stored);

        localStorage.setItem("lastViewedEmployee", currentId);
    }, [currentId]);

    if (!lastViewed || lastViewed === currentId) return null;

    return (
        <p className="text-xs text-gray-400">
            Previously viewed: {lastViewed}
        </p>
    );
}