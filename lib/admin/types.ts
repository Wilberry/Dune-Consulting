export type StaffRole = "admin" | "editor";

export type StaffUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: StaffRole;
};
