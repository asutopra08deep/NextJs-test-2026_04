import { Employee, Department, Stats } from "@/types";

export const departments: Department[] = [
  { id: "d1", name: "Engineering", headCount: 25 },
  { id: "d2", name: "Marketing", headCount: 12 },
  { id: "d3", name: "Sales", headCount: 18 },
  { id: "d4", name: "HR", headCount: 8 },
  { id: "d5", name: "Finance", headCount: 10 },
];

export let employees: Employee[] = [
  {
    id: "e1",
    firstName: "Alice",
    lastName: "Johnson",
    email: "alice.johnson@company.com",
    department: departments[0],
    position: "Senior Engineer",
    salary: 95000,
    startDate: "2024-03-15",
    skills: ["React", "TypeScript", "Node.js"],
    status: "active",
  },
  {
    id: "e2",
    firstName: "Bob",
    lastName: "Smith",
    email: "bob.smith@company.com",
    department: departments[1],
    position: "Marketing Manager",
    salary: 78000,
    startDate: "2023-07-01",
    skills: ["SEO", "Content Strategy", "Analytics"],
    status: "active",
  },
  {
    id: "e3",
    firstName: "Carol",
    lastName: "Williams",
    email: "carol.williams@company.com",
    department: departments[2],
    position: "Sales Executive",
    salary: 65000,
    startDate: "2024-01-10",
    skills: ["CRM", "Negotiation", "Salesforce"],
    status: "active",
  },
  {
    id: "e4",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@company.com",
    department: departments[0],
    position: "Junior Engineer",
    salary: 60000,
    startDate: "2024-04-01",
    skills: ["JavaScript", "CSS", "React"],
    status: "pending",
  },
  {
    id: "e5",
    firstName: "Eve",
    lastName: "Davis",
    email: "eve.davis@company.com",
    department: departments[3],
    position: "HR Specialist",
    salary: 55000,
    startDate: "2023-11-20",
    skills: ["Recruitment", "Onboarding", "Labor Law"],
    status: "active",
  },
  {
    id: "e6",
    firstName: "Frank",
    lastName: "Miller",
    email: "frank.miller@company.com",
    department: departments[4],
    position: "Financial Analyst",
    salary: 72000,
    startDate: "2022-06-15",
    skills: ["Excel", "Financial Modeling", "SQL"],
    status: "active",
  },
  {
    id: "e7",
    firstName: "Grace",
    lastName: "Wilson",
    email: "grace.wilson@company.com",
    department: null,
    position: "Contractor",
    salary: 0,
    startDate: "2024-02-28",
    skills: ["Design", "Figma"],
    status: "inactive",
  },
  {
    id: "e8",
    firstName: "Henry",
    lastName: "Moore",
    email: "henry.moore@company.com",
    department: departments[0],
    position: "Tech Lead",
    salary: 110000,
    startDate: "2021-05-10",
    skills: ["Go", "Kubernetes", "AWS", "TypeScript"],
    status: "active",
  },
];

// ⚠ BUG-009: This function mutates the shared module-level array directly.
// React state won't detect the change because the reference stays the same.
export function addEmployee(employee: Employee): Employee[] {
  employees.push(employee);
  return employees;
}

export function getEmployeeById(id: string): Employee | undefined {
  return employees.find((e) => e.id === id);
}

export function getStats(): Stats {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();

  // FIX: Use a Set to track unique department IDs instead of relying on the headCount property
  const uniqueDepartments = new Set(
    employees.map((e) => e.department?.id).filter(Boolean),
  );

  return {
    totalEmployees: employees.length,
    activeEmployees: employees.filter((e) => e.status === "active").length,
    departments: uniqueDepartments.size,
    newHiresThisMonth: employees.filter((e) => {
      const d = new Date(e.startDate);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length,
  };
}
