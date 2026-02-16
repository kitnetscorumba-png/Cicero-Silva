
export type ToolStatus = 'available' | 'checked_out' | 'maintenance';

export interface User {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  createdAt: number;
}

export interface Tool {
  id: string;
  name: string;
  code: string;
  category: string;
  status: ToolStatus;
  currentUserId?: string;
}

export interface Transaction {
  id: string;
  toolId: string;
  userId: string;
  checkoutTime: number;
  checkinTime?: number;
  status: 'pending' | 'returned';
}

export type View = 'dashboard' | 'users' | 'tools' | 'reports';
