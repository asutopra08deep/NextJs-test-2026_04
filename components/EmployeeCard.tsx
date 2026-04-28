"use client";

import Link from "next/link";
import { Employee } from "@/types";

interface EmployeeCardProps {
  employee: Employee;
  onDelete?: (id: string) => void;
}

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
};

export default function EmployeeCard({
  employee,
  onDelete,
}: EmployeeCardProps) {
  // ⚠ BUG-012: No null check — if `employee.department` is null (see Grace Wilson),
  // this line throws "Cannot read properties of null (reading 'name')"
  const departmentName = employee.department?.name || "Unassigned"; //fixed BUG-012 here

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-900">
            {employee.firstName} {employee.lastName}
          </h3>
          <p className="text-sm text-gray-500">{employee.position}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[employee.status]}`}
        >
          {employee.status}
        </span>
      </div>

      <div className="text-sm text-gray-600">
        <p>{employee.email}</p>
        <p className="mt-1">{departmentName}</p>
      </div>

      <div className="flex flex-wrap gap-1">
        {/* ⚠ BUG-003: Using array index as key. If skills are sorted or
            filtered, React will reuse the wrong DOM nodes and produce
            incorrect diff/animation results. */}
        {employee.skills.map((skill) => (
          <span
            key={skill} //bug-003 fixed here (remove index and use skill)
            className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
        <Link
          href={`/employees/${employee.id}`}
          className="text-sm text-blue-600 hover:underline"
        >
          View details
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(employee.id)}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
}
