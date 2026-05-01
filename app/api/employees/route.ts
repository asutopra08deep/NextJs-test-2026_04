import { NextRequest, NextResponse } from "next/server";
import { employees, addEmployee } from "@/lib/data";
import { Employee } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "5");

  let filtered = [...employees];

  // ⚠ BUG-008: Search is case-sensitive — "alice" won't match "Alice"
  if (search) {
    filtered = filtered.filter(
      (e) =>
        e.firstName.includes(search) ||
        e.lastName.includes(search) ||
        e.email.includes(search),
    );
  }

  if (status) {
    filtered = filtered.filter((e) => e.status === status);
  }

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const data = filtered.slice(start, start + pageSize);

  return NextResponse.json({ data, total, page, pageSize });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      firstName,
      lastName,
      email,
      position,
      salary,
      startDate,
      skills,
      status,
    } = body;

    if (!firstName || !lastName || !email || !position) {
      return NextResponse.json(
        { message: "Missing required fields", code: "VALIDATION_ERROR" },
        { status: 400 },
      );
    }

    const newEmployee: Employee = {
      id: `e${Date.now()}`,
      firstName,
      lastName,
      email,
      department: null,
      position,
      salary: salary ?? 0,
      startDate: startDate ?? new Date().toISOString().split("T")[0],
      skills: skills ?? [],
      status: status ?? "pending",
    };

    addEmployee(newEmployee);

    return NextResponse.json({ employee: newEmployee }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error", code: "SERVER_ERROR" },
      { status: 500 },
    );
  }
}
