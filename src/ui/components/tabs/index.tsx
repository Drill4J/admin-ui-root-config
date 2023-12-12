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
import React, { Children, ReactNode, useState } from "react";
import "twin.macro";

const Tab = ({ children }: any) => children;

type TabsProps = {
  children: ReactNode;
  onChange?: () => void;
};

const Tabs = ({ children, onChange = () => {} }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number) => {
    if (index === activeTab) return;
    onChange();
    setActiveTab(index);
  };

  return (
    <div>
      <div>{Children.toArray(children)[activeTab]}</div>
      <div tw="inline-flex justify-center mt-5 w-full">
        {Children.map(children, (child: any, index) => (
          <div
            style={{ cursor: "pointer" }}
            tw="text-14 text-center text-blue-default m-2"
            onClick={() => handleTabClick(index)}
          >
            {child.props.title}
          </div>
        )).toSpliced(activeTab, 1)}
      </div>
    </div>
  );
};

export { Tabs, Tab };
