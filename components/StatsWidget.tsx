"use client";

import { Stats } from "@/types";
import { useEffect, useState, useRef } from "react";

interface StatsWidgetProps {
  initialStats: Stats;
}

export default function StatsWidget({ initialStats }: StatsWidgetProps) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const timerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch("/api/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    }
    fetchStats();
  }, []);

  // Most efficient fix: bypass React state entirely to avoid re-rendering
  // the whole component every second. We just update the DOM directly.
  useEffect(() => {
    let seconds = 0;
    const interval = setInterval(() => {
      seconds += 1;
      if (timerRef.current) {
        timerRef.current.textContent = `Time on page: ${seconds}s`;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    { label: "Total Employees", value: stats.totalEmployees, color: "blue" },
    { label: "Active", value: stats.activeEmployees, color: "green" },
    { label: "Departments", value: stats.departments, color: "purple" },
    {
      label: "New This Month",
      value: stats.newHiresThisMonth,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-lg shadow p-4">
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>
      <p ref={timerRef} className="text-xs text-gray-400 text-right">
        Time on page: 0s
      </p>
    </div>
  );
}
