/** @jsxImportSource @emotion/react */
// import { jsx } from "@emotion/react";
import { Form, Input } from "antd";
import { UserSelect } from "../../components/user-select";
import { Project, User } from "../../types/project";

interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
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
        <UserSelect
          value={param.personId}
          onChange={(value) => setParam({ ...param, personId: value })}
          defaultOptionName="负责人"
        />
      </Form.Item>
    </Form>
  );
};
