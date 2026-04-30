"use client";

import EmployeeCard from "@/components/EmployeeCard";
import EmployeeForm from "@/components/EmployeeForm";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";
import { useEmployees } from "@/hooks/useEmployees";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

export default function EmployeesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const showForm = searchParams.get("add");
  const setShowForm = (show: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (show) {
      params.set("add", "true");
    } else {
      params.delete("add");
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { employees, total, loading, error, refetch } = useEmployees({
    search,
    status,
    page,
    pageSize: 5,
  });

  // ⚠ BUG-009 (client side): After addEmployee() mutates the array in-place,
  // calling refetch just re-fetches with the same stale module reference.
  // The list might not update visually because React sees no state change.
  const handleFormSuccess = useCallback(() => {
    setShowForm(false);
    refetch();
  }, [refetch]);

  const handleDelete = useCallback(
    async (id: string) => {
      await fetch(`/api/employees/${id}`, { method: "DELETE" });
      refetch();
    },
    [refetch],
  );

  const handleSearch = useCallback((query: string) => {
    setSearch(query);
    setPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
          <p className="text-gray-500 mt-1">{total} total employees</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          {showForm ? "Cancel" : "Add Employee"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">New Employee</h3>
          <EmployeeForm onSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <SearchBar onSearch={handleSearch} />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {loading && (
        <div className="text-center text-gray-400 py-8">Loading...</div>
      )}

      {error && <div className="text-center text-red-500 py-8">{error}</div>}

      {!loading && !error && employees.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No employees found.
        </div>
      )}

      {!loading && !error && (
        <div className="grid gap-4 sm:grid-cols-2">
          {employees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onDelete={handleDelete} />
          ))}
        </div>
      )}

      <Pagination
        total={total}
        page={page}
        pageSize={5}
        onPageChange={setPage}
      />
    </div>
  );
}
