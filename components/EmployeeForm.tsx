"use client";

import { useState } from "react";

interface EmployeeFormProps {
  onSuccess: () => void;
}

export default function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ⚠ BUG-010: `skills` is an uncontrolled default value string but the other
  // fields below are fully controlled with useState. Mixing controlled and
  // uncontrolled inputs in the same form causes React warnings and makes it
  // impossible to reset the form programmatically after submission.
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    position: "",
    salary: "",
    startDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const skillsInput = (document.getElementById("skills") as HTMLInputElement).value;
    const skills = skillsInput.split(",").map((s) => s.trim()).filter(Boolean);

    const res = await fetch("/api/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        salary: Number(form.salary),
        skills,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.message ?? "Something went wrong");
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {(["firstName", "lastName", "email", "position", "salary", "startDate"] as const).map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700 capitalize mb-1">
              {field.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={field === "salary" ? "number" : field === "startDate" ? "date" : "text"}
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>

      {/* Uncontrolled input — not linked to state */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Skills (comma-separated)
        </label>
        <input
          id="skills"
          type="text"
          defaultValue=""
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Adding..." : "Add Employee"}
      </button>
    </form>
  );
}
