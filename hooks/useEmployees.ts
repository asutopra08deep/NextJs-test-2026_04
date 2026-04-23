"use client";

import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/types";

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

export function useEmployees(options: UseEmployeesOptions = {}): UseEmployeesResult {
  const { search = "", status = "", page = 1, pageSize = 5 } = options;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      search,
      status,
      page: String(page),
      pageSize: String(pageSize),
    });

    // ⚠ BUG-004: No AbortController — if the user types quickly, a slow earlier
    // request can resolve AFTER a newer one and overwrite the correct results.
    const res = await fetch(`/api/employees?${params}`);

    if (!res.ok) {
      setError("Failed to fetch employees");
      setLoading(false);
      return;
    }

    const json = await res.json();
    setEmployees(json.data);
    setTotal(json.total);
    setLoading(false);
  }, [search, status, page, pageSize]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees, total, loading, error, refetch: fetchEmployees };
}
