export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  UNDEFINED = 'UNDEFINED',
}

export type UserData = {
  blocked: boolean;
  id: number;
  role: Role;
  username: string;
}
