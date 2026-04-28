import { notFound } from "next/navigation";
import { getEmployeeById } from "@/lib/data";
import Link from "next/link";
import LastViewed from "@/components/LastViewed";

interface EmployeeDetailPageProps {
  params: { id: string };
}

export default function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const employee = getEmployeeById(params.id);

  if (!employee) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/employees" className="hover:text-blue-600">
          Employees
        </Link>
        <span>/</span>
        <span>
          {employee.firstName} {employee.lastName}
        </span>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-gray-500">{employee.position}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              employee.status === "active"
                ? "bg-green-100 text-green-800"
                : employee.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-800"
            }`}
          >
            {employee.status}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Email</dt>
            <dd className="text-gray-900">{employee.email}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Department</dt>
            <dd className="text-gray-900">
              {employee.department?.name ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Salary</dt>
            <dd className="text-gray-900">
              {employee.salary > 0
                ? `$${employee.salary.toLocaleString()}`
                : "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Start Date</dt>
            <dd className="text-gray-900">{employee.startDate}</dd>
          </div>
        </dl>

        <div>
          <p className="text-sm text-gray-500 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {employee.skills.map((skill) => (
              <span
                key={skill}
                className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* new created component */}
        <LastViewed employeeId={employee.id} />
      </div>

      <Link href="/employees" className="text-sm text-blue-600 hover:underline">
        ← Back to employees
      </Link>
    </div>
  );
}
