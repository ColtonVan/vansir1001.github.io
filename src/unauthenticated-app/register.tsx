import { Form, Input } from "antd";
import { LongButton } from ".";
import { useAuth } from "../context/auth-context";
export const Register = ({ onError }: { onError: (error: Error) => void }) => {
  const { register, user } = useAuth();
  const submitHandler = async ({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) => {
    if (cpassword !== values.password) {
      return onError(new Error("请确认两次输入的密码相同"));
    }
    try {
      await register(values);
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
      <Form.Item
        name="cpassword"
        rules={[{ required: true, message: "请确认密码" }]}
      >
        <Input placeholder="确认密码" type="password" id="cpassword" />
      </Form.Item>
      <LongButton type="primary" htmlType="submit">
        注册
      </LongButton>
    </Form>
  );
};
