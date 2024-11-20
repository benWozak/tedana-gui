import React from "react";

type Props = {
  children: React.ReactNode;
  title?: string;
};

export function Section({ children, title }: Props) {
  return (
    <section className="border rounded-lg px-8 py-4 mt-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {children}
    </section>
  );
}
