import { createContext, useContext, ReactNode } from "react";
import * as auth from "../auth-provider";
import { useMount } from "../utils";
import { http } from "../utils/http";
import { useAsync } from "../utils/use-async";
import { FullPageErrorFallback, FullPageLoading } from "../components/lib";
import { useQueryClient } from "react-query";
import { User } from "../types/project";
interface AuthContextProps {
  user: User | null;
  login: (form: AuthForm) => Promise<void>;
  register: (form: AuthForm) => Promise<void>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);
AuthContext.displayName = "AuthContext";

interface AuthForm {
  username: string;
  password: string;
}
const bootstrapUser = async () => {
  let user = null;
  const token = auth.getToken();
  if (token) {
    const data = await http("me", { token });
    user = data.user;
  }
  return user;
};
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const {
    data: user,
    error,
    isLoading,
    isIdle,
    isError,
    run,
    setData: setUser,
  } = useAsync<User | null>();
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));
  const queryClient = useQueryClient();
  useMount(() => {
    run(bootstrapUser());
    queryClient.clear();
  });
  if (isIdle || isLoading) {
    return <FullPageLoading />;
  }
  if (isError) {
    return <FullPageErrorFallback error={error} />;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth必须在AuthProvider中使用");
  return context;
};
