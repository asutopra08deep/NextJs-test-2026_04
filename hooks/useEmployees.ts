"use client";

import { Employee } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface UseEmployeesOptions {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}

interface UseEmployeesResult {
  employees: Employee[];
  total: number;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEmployees(
  options: UseEmployeesOptions = {},
): UseEmployeesResult {
  const { search = "", status = "", page = 1, pageSize = 5 } = options;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        search,
        status,
        page: String(page),
        pageSize: String(pageSize),
      });

      try {
        const res = await fetch(`/api/employees?${params}`, { signal });

        if (!res.ok) {
          setError("Failed to fetch employees");
          setLoading(false);
          return;
        }

        const json = await res.json();
        setEmployees(json.data);
        setTotal(json.total);
        setLoading(false);
      } catch (err: any) {
        if (err.name === "AbortError") {
          return;
        }
        setError(err.message || "An unexpected error occurred");
        setLoading(false);
      }
    },
    [search, status, page, pageSize],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchEmployees(controller.signal);
    return () => controller.abort();
  }, [fetchEmployees]);

  const handleRefetch = useCallback(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, total, loading, error, refetch: handleRefetch };
}
