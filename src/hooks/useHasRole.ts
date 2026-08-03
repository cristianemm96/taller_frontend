import { getUserFromToken } from '../utils/auth';

interface Role {
  id: number;
  name: string;
}

// 1. Tipamos allowedRoles como string[]
export const useHasRole = (allowedRoles: string[] = []): boolean => {
  const user = getUserFromToken();

  if (!user || !user.roles || user.roles.length === 0) {
    return false;
  }

  // 2. Comparamos el name del objeto role contra el array de strings
  return user.roles.some((role: Role) => allowedRoles.includes(role.name));
};