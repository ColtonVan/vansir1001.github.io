import { Drawer } from "antd";
import { ComponentProps } from "react";

interface ProjectModalProps extends ComponentProps<typeof Drawer> {
  projectModalOpen: boolean;
}

export const ProjectModal = (props: ProjectModalProps) => {
  return (
    <Drawer width="100%" visible={props.projectModalOpen} {...props}></Drawer>
  );
};
