"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

  const abortRef = useRef<AbortController | null>(null);

  const fetchEmployees = useCallback(async () => {
    abortRef.current?.abort();

    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        search,
        status,
        page: String(page),
        pageSize: String(pageSize),
      });

      // ⚠ BUG-004: No AbortController — if the user types quickly, a slow earlier
      // request can resolve AFTER a newer one and overwrite the correct results.
      const res = await fetch(`/api/employees?${params}`, {
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error("Failed to fetch employees");
      }

      const json = await res.json();

      setEmployees(json.data);
      setTotal(json.total);
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Something went wrong");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [search, status, page, pageSize]);

  useEffect(() => {
    fetchEmployees();

    return () => {
      abortRef.current?.abort();
    };
  }, [fetchEmployees]);

  return { employees, total, loading, error, refetch: fetchEmployees };
}