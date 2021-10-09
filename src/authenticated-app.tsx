import { ProjectListScreen } from "./screens/project-list";
import { Button } from "antd";
import { useAuth } from "./context/auth-context";

export const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <div>
      <Button onClick={() => logout()}>登出</Button>
      <ProjectListScreen />
    </div>
  );
};
