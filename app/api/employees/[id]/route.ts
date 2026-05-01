import { NextRequest, NextResponse } from "next/server";
import { employees } from "@/lib/data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const employee = employees.find((e) => e.id === params.id);

  if (!employee) {
    return NextResponse.json(
      { message: "Employee not found", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  return NextResponse.json({ employee });
}

// ⚠ BUG-006 (API): This handler is named PATCH but the client calls PUT.
// The route will never match a PUT request from the frontend.
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = employees.findIndex((e) => e.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { message: "Employee not found", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  const body = await request.json();
  const updated = { ...employees[index], ...body, id: params.id };
  employees[index] = updated;

  return NextResponse.json({ employee: updated });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const index = employees.findIndex((e) => e.id === params.id);

  if (index === -1) {
    return NextResponse.json(
      { message: "Employee not found", code: "NOT_FOUND" },
      { status: 404 }
    );
  }

  employees.splice(index, 1);
  return NextResponse.json({ success: true });
}
