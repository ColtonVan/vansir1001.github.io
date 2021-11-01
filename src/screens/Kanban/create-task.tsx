import { Card, Input } from "antd";
import React, { useState } from "react";
import { useAddTask } from "utils/task";
import { useProjectIdInUrl, useTasksQueryKey } from "./util";

export const CreateTask = ({ kanbanId }: { kanbanId: number }) => {
  const projectId = useProjectIdInUrl();
  const { mutateAsync: addTask } = useAddTask(useTasksQueryKey());
  const [name, setName] = useState("");
  const [inputMode, setInputMode] = useState(false);
  const submit = async () => {
    addTask({ projectId, kanbanId, name });
    setName("");
    setInputMode(false);
  };
  const toggle = () => setInputMode(!inputMode);
  if (!inputMode)
    return (
      <div style={{ cursor: "pointer" }} onClick={toggle}>
        +创建事务
      </div>
    );
  return (
    <Card>
      <Input
        onBlur={toggle}
        value={name}
        autoFocus={true}
        onChange={(evt) => setName(evt.target.value)}
        onPressEnter={submit}
        placeholder="需要做些什么"
      />
    </Card>
  );
};
