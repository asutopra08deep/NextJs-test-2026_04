"use client";

import { useState, useEffect } from "react";
import { Stats } from "@/types";

interface StatsWidgetProps {
  initialStats: Stats;
}

export default function StatsWidget({ initialStats }: StatsWidgetProps) {
  const [stats, setStats] = useState<Stats>(initialStats);
  const [secondsOnPage, setSecondsOnPage] = useState(0);

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

  // ⚠ BUG-002: Stale closure. `secondsOnPage` inside the interval always reads
  // the value from the first render (0). The counter will never go above 1.
  // Fix: use the functional updater form → setSecondsOnPage(prev => prev + 1)
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsOnPage((prev) => prev + 1); //fixed BUG-002 here
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
      <p className="text-xs text-gray-400 text-right">
        Time on page: {secondsOnPage}s
      </p>
    </div>
  );
}
