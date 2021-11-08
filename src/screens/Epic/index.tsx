import { Button, List, Modal } from "antd";
import { Row, ScreenContainer } from "components/lib";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjectInUrl } from "screens/Kanban/util";
import { useDeleteEpic, useEpics } from "utils/epic";
import { useTasks } from "utils/task";
import { CreateEpic } from "./create-epic";
import { useEpicsQueryKey, useEpicsSearchParams } from "./utils";

export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics(useEpicsSearchParams());
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);
  const { mutate: deleteEpic } = useDeleteEpic(useEpicsQueryKey());
  const handleDeleteEpic = (id: number) => {
    Modal.confirm({
      title: "确定删除任务组吗",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        deleteEpic({ id });
      },
    });
  };
  return (
    <ScreenContainer>
      <Row between={true}>
        <h1>{currentProject?.name}任务组</h1>
        <Button
          onClick={() => {
            setEpicCreateOpen(true);
          }}
        >
          创建任务组
        </Button>
      </Row>
      <List
        style={{ overflow: "scroll" }}
        dataSource={epics}
        itemLayout="vertical"
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button onClick={() => handleDeleteEpic(epic.id)} type="link">
                    删除
                  </Button>
                </Row>
              }
              description={
                <div>
                  <div>开始时间：{dayjs(epic.start).format("YYYY-MM-DD")}</div>
                  <div>结束时间：{dayjs(epic.start).format("YYYY-MM-DD")}</div>
                </div>
              }
            />
            <div>
              {tasks?.map((task) => (
                <Link
                  to={`/projects/${task.projectId}/kanban?editingTaskId=${task.id}`}
                  key={task.id}
                >
                  {task.name}
                </Link>
              ))}
            </div>
          </List.Item>
        )}
      />
      <CreateEpic
        visible={epicCreateOpen}
        onClose={() => setEpicCreateOpen(false)}
      />
    </ScreenContainer>
  );
};
