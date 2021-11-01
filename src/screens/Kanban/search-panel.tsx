import { Button, Input } from "antd";
import { Row } from "components/lib";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useSetUrlSearchParam } from "utils/url";
import { useTaskSearchParams } from "./util";

export const SearchPanel = () => {
  const searchParams = useTaskSearchParams();
  const setSearchParams = useSetUrlSearchParam();
  const reset = () => {
    setSearchParams({
      projectId: undefined,
      typeId: undefined,
      tagId: undefined,
      name: undefined,
      processorId: undefined,
    });
  };
  return (
    <Row marginBottom={4} gap={3}>
      <Input
        style={{ width: "20rem" }}
        placeholder="任务名"
        value={searchParams.name}
        onChange={(evt) => setSearchParams({ name: evt.target.value })}
      />
      <UserSelect
        defaultOptionName="经办人"
        value={searchParams.processorId}
        onChange={(processorId) => setSearchParams({ processorId })}
      />
      <TaskTypeSelect
        defaultOptionName="类型"
        value={searchParams.typeId}
        onChange={(typeId) => setSearchParams({ typeId })}
      />
      <Button onClick={reset}>清除筛选器</Button>
    </Row>
  );
};
