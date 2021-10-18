import { User } from "./search-panel";
import { Table } from "antd";
import dayjs from "dayjs";

interface Project {
  id: string;
  name: string;
  personId: string;
  pin: boolean;
  organization: string;
  created: number;
}
interface ListProps {
  list: Project[];
  users: User[];
}
export const List = ({ list, users }: ListProps) => {
  const columns = [
    {
      dataIndex: "name",
      title: "名称",
    },
    {
      dataIndex: "organization",
      title: "部门",
    },
    {
      dataIndex: "personId",
      title: "负责人",
      render: (personId: string) =>
        users.find((item1) => item1.id === personId)?.name ?? "未知",
    },
    {
      dataIndex: "created",
      title: "创建时间",
      render: (created: number) =>
        created ? dayjs(created).format("YYYY-MM-DD") : "无",
    },
  ];
  return (
    <Table columns={columns} dataSource={list} />
    // <table>
    //   <thead>
    //     <tr>
    //       <th>名称</th>
    //       <th>负责人</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {list.map((project) => (
    //       <tr key={project.id}>
    //         <td>{project.name}</td>
    //         <td>
    //           {users.find((user) => user.id === project.personId)?.name ??
    //             "未知"}
    //         </td>
    //       </tr>
    //     ))}
    //   </tbody>
    // </table>
  );
};
