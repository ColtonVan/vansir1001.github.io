/** @jsxImportSource @emotion/react */
// import { jsx } from "@emotion/react";
import { Form, Input, Select } from "antd";
const { Option } = Select;
export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  organization: string;
  token: string;
}
interface SearchPanelProps {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: SearchPanelProps["param"]) => void;
}
export const SearchPanel = ({ param, setParam, users }: SearchPanelProps) => {
  return (
    <Form
      css={{ marginBottom: "2rem" }}
      layout="inline"
      initialValues={{ name: param.name, personId: param.personId }}
    >
      <Form.Item name="name">
        <Input
          placeholder="项目名"
          type="text"
          onChange={(e) => setParam({ ...param, name: e.target.value })}
        />
      </Form.Item>
      <Form.Item name="personId">
        <Select onChange={(e) => setParam({ ...param, personId: String(e) })}>
          <Option value="">负责人</Option>
          {users.map((item) => (
            <Option key={item.id} value={String(item.id)}>
              {item.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
