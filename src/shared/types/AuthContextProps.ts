import type { AuthUser } from "../../features/Auth/auth.service";


export interface AuthContextProps {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}
