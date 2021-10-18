import { useAuth } from "../context/auth-context";
import { Form, Input } from "antd";
import { LongButton } from ".";
import { useAsync } from "../utils/use-async";
export const Login = ({ onError }: { onError: (error: Error) => void }) => {
  const { login, user } = useAuth();
  const { run, isLoading } = useAsync();
  const submitHandler = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      await run(login(values));
    } catch (e) {
      onError(e as Error);
    }
  };
  return (
    <Form onFinish={submitHandler}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: "请输入用户名" }]}
      >
        <Input placeholder="用户名" type="text" id="username" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "请输入密码" }]}
      >
        <Input placeholder="密码" type="password" id="password" />
      </Form.Item>
      <LongButton loading={isLoading} block type="primary" htmlType="submit">
        登录
      </LongButton>
    </Form>
  );
};
