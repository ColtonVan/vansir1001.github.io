import { Button, Form, Input, Modal } from "antd";
import { useForm } from "antd/lib/form/Form";
import { TaskTypeSelect } from "components/task-type-select";
import { UserSelect } from "components/user-select";
import { useEffect } from "react";
import { useDeleteTask, useEditTask } from "utils/task";
import { useTaskModal, useTasksQueryKey } from "./util";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export const TaskModal = () => {
  const [form] = useForm();
  const { editingTask, editingTaskId, close } = useTaskModal();
  const { mutateAsync: editTask, isLoading: editingLoading } = useEditTask(
    useTasksQueryKey()
  );
  const { mutateAsync: deleteTask, isLoading: deleteLoading } = useDeleteTask(
    useTasksQueryKey()
  );
  const onCancel = () => {
    close();
    form.resetFields();
  };
  const onOk = async () => {
    await editTask({ ...editingTask, ...form.getFieldsValue() });
    close();
  };
  const startDelete = () => {
    Modal.confirm({
      title: "确定删除任务吗",
      okText: "确定",
      cancelText: "取消",
      async onOk() {
        await deleteTask({ id: Number(editingTaskId) });
        close();
      },
    });
  };
  useEffect(() => {
    form.setFieldsValue(editingTask);
  }, [form, editingTask]);
  return (
    <Modal
      forceRender={true}
      confirmLoading={editingLoading}
      cancelText="取消"
      okText="确定"
      title="编辑任务"
      onCancel={onCancel}
      onOk={async () => {
        form.validateFields();
        onOk();
      }}
      visible={Boolean(editingTaskId)}
    >
      <Form form={form} initialValues={editingTask} {...layout}>
        <Form.Item
          name="name"
          label="事务名"
          rules={[{ required: true, message: "请输入事务名" }]}
        >
          <Input placeholder="请输入事务名称" />
        </Form.Item>
        <Form.Item name="processor" label="经办人">
          <UserSelect defaultOptionName="经办人" />
        </Form.Item>
        <Form.Item name="typeId" label="类型">
          <TaskTypeSelect />
        </Form.Item>
      </Form>
      <div style={{ textAlign: "right" }}>
        <Button
          loading={deleteLoading}
          style={{ fontSize: "14px" }}
          size="small"
          onClick={startDelete}
        >
          删除
        </Button>
      </div>
    </Modal>
  );
};
