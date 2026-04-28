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

export function useEmployees(
  options: UseEmployeesOptions = {},
): UseEmployeesResult {
  const { search = "", status = "", page = 1, pageSize = 5 } = options;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Create a ref to keep track of the current AbortController
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchEmployees = useCallback(async () => {
    // FIX BUG-004: Abort the previous request if it's still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new controller for this specific request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      search,
      status,
      page: String(page),
      pageSize: String(pageSize),
    });

    try {
      // FIX BUG-009: Add cache: "no-store" and pass the abort signal
      const res = await fetch(`/api/employees?${params}`, {
        signal: controller.signal,
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch employees");
      }

      const json = await res.json();

      // FIX BUG-009: Use the spread operator to ensure a fresh array reference
      setEmployees([...json.data]);
      setTotal(json.total);
    } catch (err: any) {
      // If the error is just our intentional abort, do nothing
      if (err.name === "AbortError") {
        return;
      }
      setError(err.message || "An error occurred");
    } finally {
      // Only remove the loading state if this is the most recent request
      if (abortControllerRef.current === controller) {
        setLoading(false);
      }
    }
  }, [search, status, page, pageSize]);

  useEffect(() => {
    fetchEmployees();

    // Cleanup function: abort request if the component unmounts early
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchEmployees]);

  return { employees, total, loading, error, refetch: fetchEmployees };
}
