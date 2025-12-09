export enum ProcessType {
  ONBOARDING = 'ONBOARDING',
  OFFBOARDING = 'OFFBOARDING'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export enum UserRole {
  HR = 'HR',
  IT = 'IT',
  ADMIN = 'ADMIN'
}

export interface Task {
  id: string;
  description: string;
  isCompleted: boolean;
  category?: string;
  department: UserRole; // Who is responsible for this task
  timeline?: string; // e.g., "Day 1", "Week -1"
}

export interface EmployeeRequest {
  id: string;
  employeeName: string;
  role: string;
  department: string;
  startDate: string; // or last day for offboarding
  type: ProcessType;
  status: RequestStatus;
  notes?: string;
  checklist: Task[];
  createdAt: number;
}