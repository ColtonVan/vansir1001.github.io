import { Button, List } from "antd";
import { Row, ScreenContainer } from "components/lib";
import dayjs from "dayjs";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjectInUrl } from "screens/Kanban/util";
import { useEpics } from "utils/epic";
import { useTasks } from "utils/task";
import { CreateEpic } from "./create-epic";
import { useEpicsSearchParams } from "./utils";

export const EpicScreen = () => {
  const { data: currentProject } = useProjectInUrl();
  const { data: epics } = useEpics();
  const { data: tasks } = useTasks({ projectId: currentProject?.id });
  const [epicCreateOpen, setEpicCreateOpen] = useState(false);
  return (
    <ScreenContainer>
      <Row>
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
        dataSource={epics}
        itemLayout="vertical"
        renderItem={(epic) => (
          <List.Item>
            <List.Item.Meta
              title={
                <Row between={true}>
                  <span>{epic.name}</span>
                  <Button type="link">删除</Button>
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
      {/* <CreateEpic visible={copen}/>  */}
    </ScreenContainer>
  );
};
