import React, { Children, ReactNode, useState } from "react";
import tw, { styled } from "twin.macro";

const Tab = ({ children }: any) => {
  return children;
};

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
