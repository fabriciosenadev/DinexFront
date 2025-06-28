import { createContext } from "react";
import type { AuthContextProps } from "../types/AuthContextProps"; // Crie este type ou coloque inline

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);
