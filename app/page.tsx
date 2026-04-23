import { getStats } from "@/lib/data";
import StatsWidget from "@/components/StatsWidget";
import Link from "next/link";

export default function DashboardPage() {
  const stats = getStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Overview of your workforce</p>
      </div>

      <StatsWidget initialStats={stats} />

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <Link
            href="/employees"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            View All Employees
          </Link>
          <Link
            href="/employees?add=true"
            className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 text-sm"
          >
            Add New Employee
          </Link>
        </div>
      </div>
    </div>
  );
}
