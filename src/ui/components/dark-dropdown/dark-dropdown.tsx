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
import React, { useRef } from "react";
import tw, { styled } from "twin.macro";

import { Icons, Popover, useIntersectionSide } from "@drill4j/ui-kit";

type Value = string | number;

interface Item {
  value: Value;
  label: React.ReactNode;
}

interface Props {
  items: Item[];
  onChange: (value: Value) => void;
  value: Value;
}
// TODo remove this component
export const DarkDropdown = ({
  items, onChange, value, ...rest
}: Props) => {
  const labelNode = useRef<HTMLDivElement>(null);
  const itemHeight = 32;
  const dropdownHeight = itemHeight * items.length;
  const listMargin = 4;
  const selectedValue = items.find((item) => value === item.value);

  return (
    <Popover>
      {({ setIsOpen, isOpen }) => {
        const { ref, intersectionSide } = useIntersectionSide({ dependency: [isOpen] });
        const { height: dropdownLabelHeight = 0 } = labelNode?.current?.getBoundingClientRect() || {};

        return (
          <>
            <div tw="flex items-center gap-x-1 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <span ref={labelNode} data-test="dropdown:selected-value">
                {selectedValue && selectedValue.label}
              </span>
              <Icons.Expander width={8} height={8} rotate={isOpen ? -90 : 90} />
              {isOpen && (
                <ScrollContainer
                  ref={ref}
                  style={{
                    top: intersectionSide === "bottom" ? `-${dropdownHeight + listMargin}px` : `${dropdownLabelHeight + listMargin}px`,
                  }}
                  {...rest}
                >
                  {items.map(({ label, value: itemValue }) => (
                    <div
                      tw="flex items-center px-4 py-2 text-monochrome-medium-tint text-14 leading-20 hover:bg-monochrome-dark100"
                      data-test="dropdown:item"
                      onClick={(() => onChange(itemValue))}
                      key={value}
                    >
                      {itemValue === value && <Icons.Check width={14} height={10} viewBox="0 0 14 10" tw="absolute text-blue-default" />}
                      <span tw="ml-6 whitespace-nowrap font-regular">{label}</span>
                    </div>
                  ))}
                </ScrollContainer>
              )}
            </div>
          </>
        );
      }}
    </Popover>
  );
};

const ScrollContainer = styled.div`
  ${tw`overflow-auto absolute shadow bg-monochrome-black w-[200px] py-2 rounded z-50`};
    &::-webkit-scrollbar {
      ${tw`w-1 rounded bg-monochrome-light-tint`}
    };

    &::-webkit-scrollbar-thumb {
      ${tw`w-1 rounded bg-monochrome-medium-tint`}
    };
`;
