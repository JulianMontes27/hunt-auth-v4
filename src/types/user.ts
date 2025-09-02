export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: "Active" | "Away" | "Unassigned";
  teams: string[];
  jobTitle: string;
  role: string;
  location: string;
  timezone: string;
  skills: {
    name: string;
    level: number;
  }[];
  attributes: {
    [key: string]: number | string;
  };
}

export interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
}
