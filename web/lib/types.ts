import type { ReactNode } from "react";

export type Layout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type ModuleInstance = {
  id: string;
  type: string;
  layout: Layout;
  config?: Record<string, unknown>;
};

export type ModuleRenderProps = {
  instance: ModuleInstance;
};

export type ModuleDefinition = {
  type: string;
  name: string;
  icon?: ReactNode;
  defaultLayout: Layout;
  minW: number;
  minH: number;
  maxW: number;
  maxH: number;
  schema?: Record<string, unknown>;
  render: (props: ModuleRenderProps) => JSX.Element;
};
