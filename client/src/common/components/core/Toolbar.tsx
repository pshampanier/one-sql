import { useClasses } from "@/utils/classes";
import { ReactNode } from "react";

type ToolbarProps = {
  className?: string;
  children?: ReactNode;
};

export default function Toolbar({ className, children }: ToolbarProps) {
  const classes = useClasses(["flex flex-row items-center h-full space-x-1", className]);
  return <div className={classes}>{children}</div>;
}
