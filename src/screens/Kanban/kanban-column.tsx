import { Kanban } from "types/kanban";
import { useTasks } from "utils/task";
import { useTaskTypes } from "utils/task-type";
import bugIcon from "assets/bug.svg";
import taskIcon from "assets/task.svg";
import styled from "@emotion/styled";
import { Button, Card, Dropdown, Menu, Modal } from "antd";
import { useKanbansQueryKey, useTaskModal, useTaskSearchParams } from "./util";
import { CreateTask } from "./create-task";
import { Task } from "types/task";
import { Mark } from "components/mark";
import { useDeleteKanban } from "utils/kanban";
import { Row } from "components/lib";
import React from "react";
import {
  Draggable,
  DraggableProvided,
  Droppable,
  DroppableProvided,
} from "react-beautiful-dnd";

const TaskTypeIcon = ({ id }: { id: number }) => {
  const { data: taskTypes } = useTaskTypes();
  const name = taskTypes?.find((taskType) => taskType.id === id)?.name;
  if (!name) return null;
  return (
    <img
      style={{ marginLeft: "-1px", marginTop: "-5px" }}
      alt=""
      src={name === "task" ? taskIcon : bugIcon}
    />
  );
};

const TaskCard = React.forwardRef<HTMLDivElement, { task: Task }>(
  ({ task, ...props }, ref) => {
    const { startEdit } = useTaskModal();
    const { name: keyword } = useTaskSearchParams();
    return (
      <div ref={ref} {...props}>
        <Card
          onClick={() => startEdit(task.id)}
          style={{
            marginBottom: "0.5rem",
            cursor: "pointer",
          }}
        >
          <p>
            <Mark name={task.name} keyword={keyword} />
          </p>
          <TaskTypeIcon id={task.typeId} />
        </Card>
      </div>
    );
  }
);

export const KanbanColumn = React.forwardRef<
  HTMLDivElement,
  { kanban: Kanban }
>(({ kanban, ...props }, ref) => {
  const { data: allTasks } = useTasks(useTaskSearchParams());
  const tasks = allTasks?.filter((task) => task.kanbanId === kanban.id);
  return (
    <Container ref={ref} {...props}>
      <Row between={true}>
        <h3>{kanban.name}</h3>
        <More kanban={kanban} />
      </Row>

      <TaskContainer>
        <Droppable
          type="ROW"
          direction="vertical"
          droppableId={String(kanban.id)}
        >
          {(dropProvided: DroppableProvided) => (
            <div ref={dropProvided.innerRef} {...dropProvided.droppableProps}>
              {tasks?.map((task, taskIndex) => (
                <Draggable
                  key={taskIndex}
                  index={taskIndex}
                  draggableId={`drag_${kanban.id}_task${taskIndex}`}
                >
                  {(dragProvided: DraggableProvided) => (
                    <>
                      <TaskCard
                        ref={dragProvided.innerRef}
                        {...dragProvided.dragHandleProps}
                        {...dragProvided.draggableProps}
                        task={task}
                      />
                    </>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </div>
          )}
        </Droppable>
        <CreateTask kanbanId={kanban.id} />
      </TaskContainer>
    </Container>
  );
});
const More = ({ kanban }: { kanban: Kanban }) => {
  const { mutateAsync } = useDeleteKanban(useKanbansQueryKey());
  const startDelete = () => {
    Modal.confirm({
      title: "确定删除看板吗",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        mutateAsync({ id: kanban.id });
      },
    });
  };
  const overlay = (
    <Menu>
      <Menu.Item key="delete">
        <Button type="link" onClick={startDelete}>
          删除
        </Button>
      </Menu.Item>
    </Menu>
  );
  return (
    <Dropdown overlay={overlay}>
      <Button type="link">...</Button>
    </Dropdown>
  );
};

export const Container = styled.div`
  min-width: 27rem;
  border-radius: 6px;
  background-color: rgb(244, 245, 247);
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.7rem 1rem;
  margin-right: 1.5rem;
`;
const TaskContainer = styled.div`
  overflow: scroll;
  flex: 1;
  ::-webkit-scrollbar {
    display: none;
  }
`;
