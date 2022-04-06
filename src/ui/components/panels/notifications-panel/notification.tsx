/*
 * Copyright 2020 EPAM Systems
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from "react";
import { format } from "timeago.js";
import tw, { styled } from "twin.macro";
import {
  Icons, Popover, Typography, useHover, useIntersectionSide,
} from "@drill4j/ui-kit";
import { deleteNotification, readNotification, unreadNotification } from "./api";

interface Props {
  id: string,
  read: boolean,
  title: string,
  info: string,
  date?: number,
  link: React.ReactNode,
}

export const Notification = ({
  title, read, info, date, link, id,
}: Props) => {
  const { ref, isVisible } = useHover();
  return (
    <Body unread={!read} ref={ref}>
      <div
        onClick={() => (read ? unreadNotification(id) : readNotification(id))}
        tw="h-full w-9 flex justify-center items-center cursor-pointer"
      >
        <NotificationStatusIndicator active={!read || isVisible} />
      </div>
      <div tw="py-2 pr-4 min-w-[1px]">
        <LineContainer>
          <div tw="w-[calc(100% - 24px)]">
            <Typography.MiddleEllipsis tw="inline">
              <Title unread={!read}>
                <span className="ellipseMe">
                  {title}
                </span>
              </Title>
            </Typography.MiddleEllipsis>
          </div>
          <Menu id={id} read={read} />
        </LineContainer>
        <LineContainer>
          <AgentInfo>
            {info}
          </AgentInfo>
        </LineContainer>
        <LineContainer>
          {link}
          <span tw="text-12 leading-16 text-monochrome-dark-tint">{format(date || Date.now())}</span>
        </LineContainer>
      </div>
    </Body>
  );
};

const Body = styled.div(({ unread }: { unread?: boolean }) => [
  tw`grid grid-cols-[36px 1fr] mx-2 my-1 h-22 rounded-lg`,
  unread && tw`bg-monochrome-dark100`,
]);

const Title = styled.div(({ unread }: { unread?: boolean }) => [
  tw`leading-20 text-14 whitespace-nowrap`,
  unread && tw`font-bold`,
]);

const NotificationStatusIndicator = styled.div(
  ({ active }: { active?: boolean }) => [
    tw`w-1 h-16 rounded bg-monochrome-gray`,
    active && tw`bg-blue-default`,
  ],
);

const AgentInfo = styled.div`
  ${tw`text-monochrome-dark-tint text-12 leading-16 truncate`}
`;

const LineContainer = styled.div`
  ${tw`h-6 w-full flex items-center justify-between`}
`;

interface MenuProps {
  id: string,
  read: boolean,
}

const Menu = ({ id, read }: MenuProps) => (
  <div>
    <Popover>
      {({ isOpen, setIsOpen }) => {
        const { ref, intersectionSide } = useIntersectionSide({ dependency: [isOpen] });
        const position = intersectionSide === "bottom" ? "top" : "bottom";

        return (
          <MenuIcon
            onClick={() => setIsOpen(!isOpen)}
          >
            <Icons.MoreOptions height={16} width={16} rotate={90} />
            {isOpen && (
              <ItemListWrapper
                ref={ref}
                position={position}
              >
                {read ? (
                  <Item onClick={() => unreadNotification(id)}>
                    <Icons.EyeCrossed width={16} height={16} />
                    Mark as unread
                  </Item>
                ) : (
                  <Item onClick={() => readNotification(id)}>
                    <Icons.Eye width={16} height={16} />
                    Mark as read
                  </Item>
                )}
                <Item onClick={() => deleteNotification(id)}>
                  <Icons.Delete width={16} height={16} />
                  Delete
                </Item>
              </ItemListWrapper>
            )}
          </MenuIcon>
        );
      }}
    </Popover>
  </div>
);

const MenuIcon = styled.div`
  ${tw`relative flex items-center text-blue-default cursor-pointer max-h-[32px] max-w-[32px]
    hover:text-blue-medium-tint
    active:text-blue-shade
  `}
`;

type Position = "bottom" | "top"

const ItemListWrapper = styled.div<{ position: Position }>(({ position }) => [
  tw`absolute z-50 w-[200px] py-2 right-[calc(50% - 22px)] bg-monochrome-black rounded border border-solid border-monochrome-dark100`,
  position === "bottom" && tw`top-[calc(100% + 12px)]`,
  position === "top" && tw`bottom-[calc(100% + 12px)]`,
]);

const Item = styled.div`
  ${tw`flex items-center gap-x-2 h-7 px-4 text-monochrome-medium-tint text-14 leading-20`}
  ${tw`hover:bg-monochrome-dark100`}
`;
