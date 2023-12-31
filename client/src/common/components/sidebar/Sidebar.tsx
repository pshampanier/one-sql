import { cx } from "classix";
import { registerAction, registerCommand, unregisterAction } from "@/utils/commands";
import { ReactNode, useEffect, useRef, useState } from "react";

import ResizePanel from "@/components/core/ResizePanel";
import SidebarIcon from "@/icons/sidebar.svg?react";
import { secondary as colors } from "@/utils/colors";

registerCommand({
  name: "sidebar.toggle",
  description: "Toggle the sidebar",
  icon: SidebarIcon,
  shortcut: ["Meta+Alt+S", "Ctrl+Alt+S"],
});

type SidebarProps = {
  size?: number;
  className?: string;
  children: ReactNode;
};

export default function Sidebar({ size, className, children }: SidebarProps) {
  const [visible, setVisible] = useState(true);
  const [sidebarSize, setSidebarSize] = useState(size ?? 256);
  const sidebarRef = useRef(null);

  const handleResize = (width: number) => {
    setSidebarSize(width);
  };

  const toggleSidebar = () => {
    console.debug(`Toggling sidebar: ${visible ? "hide" : "show"}`);
    setVisible(!visible);
  };

  // To have a transition when hidding the sidebar we can use translate-x-0 but the issue is that the sidebar is
  // being translated out of view, but it still occupies space in the document flow, which is why the element to the
  // right of the sidebar is not moving. As a workaround we are also moving the next sibling element of the sidebar
  // changing their margin-left property. Also we need to set the width of the moved sibling element to it's current
  // width (before the translation) otherwise some children element such as the monaco editor will not be resized
  // properly when the sidebar is comming back.
  if (sidebarRef && sidebarRef.current) {
    let nextSibling = sidebarRef.current.nextSibling;
    while (nextSibling) {
      if (nextSibling.nodeType === Node.ELEMENT_NODE) {
        if (!visible) {
          nextSibling.style.width = `${nextSibling.offsetWidth}px`;
        }
        nextSibling.style.marginLeft = visible ? 0 : `-${sidebarSize}px`;
      }
      nextSibling = nextSibling.nextSibling;
    }
  }

  useEffect(() => {
    registerAction("sidebar.toggle", toggleSidebar);
    return () => {
      unregisterAction("sidebar.toggle", toggleSidebar);
    };
  }, [visible]);

  const asideClasses = cx(
    "flex flex-row flex-none overflow-y-hidden overflow-x-hidden",
    "text-sm",
    "transition-transform duration-500",
    colors("background", "text"),
    visible ? "translate-x-0" : "-translate-x-full",
    className
  );
  const resizePanelClasses = cx(visible ? "block" : "hidden");

  return (
    <>
      <aside ref={sidebarRef} className={asideClasses} style={{ width: `${sidebarSize}px` }}>
        <nav className="flex flex-col flex-grow space-y-1.5 mt-4 mb-4 px-5 overflow-y-scroll">{children}</nav>
        <ResizePanel
          className={resizePanelClasses}
          width={sidebarSize}
          minWidth={200}
          maxWidth={400}
          onResize={handleResize}
        />
      </aside>
    </>
  );
}
