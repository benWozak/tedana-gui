import React, { useState } from "react";

interface AccordionType {
  title: React.ReactNode | string;
  content: React.ReactNode | string;
}

type Props = {
  items: AccordionType[];
};

export const Accordion = ({ items }: Props) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number | null) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {items.map((item: AccordionType, index: number) => (
        <details
          key={index}
          className="bg-base-200 mb-2"
          open={openIndex === index}
        >
          <summary
            className="text-xl font-medium p-4 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              toggleItem(index);
            }}
          >
            {item.title}
          </summary>
          {openIndex === index && (
            <div className="p-4">
              <p>{item.content}</p>
            </div>
          )}
        </details>
      ))}
    </div>
  );
};
