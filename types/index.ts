export interface Department {
  id: string;
  name: string;
  headCount: number;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department | null;
  position: string;
  salary: number;
  startDate: string;
  skills: string[];
  status: "active" | "inactive" | "pending";
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Stats {
  totalEmployees: number;
  activeEmployees: number;
  departments: number;
  newHiresThisMonth: number;
}

export interface ApiError {
  message: string;
  code: string;
}
