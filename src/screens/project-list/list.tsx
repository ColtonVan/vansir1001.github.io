import { User } from "./search-panel";
import { Dropdown, Table, TableProps, Menu, Modal } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { Pin } from "../../components/pin";
import { useDeleteProject, useEditProject } from "../../utils/project";
import { ButtonNoPadding } from "../../components/lib";
import { useProjectModal, useProjectQueryKey } from "./util";

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}
interface ListProps extends TableProps<Project> {
  users: User[];
}
export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectQueryKey());
  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });
  const columns = [
    {
      title: <Pin checked={true} disabled={true} />,
      render(arg1: null, project: Project) {
        return (
          <Pin onCheckedChange={pinProject(project.id)} checked={project.pin} />
        );
      },
    },
    {
      dataIndex: "name",
      title: "名称",
      sorter: (a: Project, b: Project) => a.name.localeCompare(b.name),
      render(name: string, project: Project) {
        return <Link to={String(project.id)}>{name}</Link>;
      },
    },
    {
      dataIndex: "organization",
      title: "部门",
    },
    {
      dataIndex: "personId",
      title: "负责人",
      render: (personId: number) =>
        users.find((item1) => item1.id === personId)?.name ?? "未知",
    },
    {
      dataIndex: "created",
      title: "创建时间",
      render: (created: number) =>
        created ? dayjs(created).format("YYYY-MM-DD") : "无",
    },
    {
      render(value: undefined, project: Project) {
        return <More project={project} />;
      },
    },
  ];
  return <Table rowKey="id" pagination={false} columns={columns} {...props} />;
};
const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const { mutate: deleteMutate } = useDeleteProject(useProjectQueryKey());
  const editProject = (id: number) => () => startEdit(id);
  const deleteProject = (project: Project) => deleteMutate(project);
  const confirmDeleteProject = (project: Project) => () => {
    Modal.confirm({
      title: "确定删除这个项目吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        deleteProject(project);
      },
    });
  };
  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="edit" onClick={editProject(project.id)}>
            编辑
          </Menu.Item>
          <Menu.Item key="delete" onClick={confirmDeleteProject(project)}>
            删除
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type="link">...</ButtonNoPadding>
    </Dropdown>
  );
};
