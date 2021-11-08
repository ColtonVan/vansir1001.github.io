import styled from "@emotion/styled";
import { Divider, List, Popover, Typography } from "antd";
import { useUsers } from "utils/user";
import { CursorSpan } from "./lib";

export const UserPopover = () => {
  const { data: users } = useUsers();
  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">组员列表</Typography.Text>
      <List>
        {users?.map((user) => (
          <List.Item key={user.id}>
            <List.Item.Meta title={user.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
    </ContentContainer>
  );
  return (
    <Popover placement="bottom" content={content}>
      <CursorSpan>组员</CursorSpan>
    </Popover>
  );
};
const ContentContainer = styled.div`
  min-width: 30rem;
`;
