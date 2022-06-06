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

import tw, { styled } from "twin.macro";
import { useHistory } from "react-router-dom";
import { addQueryParamsToPath } from "@drill4j/ui-kit";

export interface Props {
  close: () => void;
}

export const InfoMenu = ({ close }: Props) => {
  const { push } = useHistory();

  return (
    <Menu>
      <div tw="overflow-hidden rounded-2xl">
        <div tw="flex flex-col gap-4 bg-monochrome-black py-6">
          <div>
            <CategoryHeader>Useful links</CategoryHeader>
            <Link href="https://drill4j.github.io/docs/faq" target="_blank">Documentation</Link>
            <Link href="https://github.com/Drill4J" target="_blank">GitHub</Link>
            <Link href="https://t.me/drill4j" target="_blank">Telegram Channel</Link>
            <Link href="https://www.epam.com/" target="_blank">EPAM Sytems</Link>
            <Link href="mailto:drill4j@gmail.com" target="_blank">Contact us</Link>
          </div>
          <div>
            <CategoryHeader>Settings</CategoryHeader>
            <Button
              onClick={() => {
                close();
                push(addQueryParamsToPath({ activeModal: "analityc" }));
              }}
            >
              Analytics
            </Button>
          </div>
        </div>
        <Line />
        <div tw="bg-[#000000]">
          <div tw="flex flex-col gap-1 pt-4 pb-6">
            <CategoryHeader>Drill4j versions</CategoryHeader>
            <Text>UI: 0.8.0-beta</Text>
            <Text>BE: 0.8.0-alfa</Text>
          </div>
        </div>
        <Line />
        <div tw="bg-[#000000] py-5">
          <Text>{`© ${new Date().getFullYear()} Drill4J. All rights reserved.`}</Text>
        </div>
      </div>
    </Menu>
  );
};

const Menu = styled.div`
  width: 310px;
  &::after {
    width: 6px;
    height: 6px;
    position: absolute;
    border: 6px solid transparent;
    content: '';
    bottom: 24px;
    left: -6px;
    border-right-color: #000000;
    border-left: none;
`;

const CategoryHeader = styled.h2`
  ${tw`flex px-6 py-2 leading-24 text-14 uppercase text-monochrome-gray font-bold`}
`;

const Link = styled.a`
  ${tw`flex px-6 py-1 leading-20 text-14 text-monochrome-white hover:bg-monochrome-default/[0.1]`}
`;
const Button = styled.button`
  ${tw`flex w-full px-6 py-1 leading-20 text-14 text-monochrome-white hover:bg-monochrome-default/[0.1]`}
`;

const Text = styled.span`
  ${tw`flex px-6 leading-24 text-14 text-monochrome-gray`}
`;

const Line = styled.div`
  ${tw`w-full h-[1px] bg-monochrome-dark100`}
`;
