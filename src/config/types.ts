export type User = {
  _id: string;
  id: string;
  username: string;
  password: string;
  roles: string[];
  active: boolean;
};

export type Note = {
  _id?: string;
  id: string;
  user: string;
  username?: string;
  title: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  noteId: number;
};

export type RolesType = {
  allowedRoles: string[];
};

export type IdParams = {
  id: string;
};
