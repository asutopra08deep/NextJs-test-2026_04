"use client";

import { useEffect, useState } from "react";

export default function LastViewed({ employeeId }: { employeeId: string }) {
  const [lastViewed, setLastViewed] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("lastViewedEmployee");
    setLastViewed(stored);

    localStorage.setItem("lastViewedEmployee", employeeId);
  }, [employeeId]);

  if (!lastViewed || lastViewed === employeeId) return null;

  return (
    <p className="text-xs text-gray-400">Previously viewed: {lastViewed}</p>
  );
}
