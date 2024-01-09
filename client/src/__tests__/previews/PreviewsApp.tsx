import Page from "@/components/Page";
import Sidebar from "@/components/sidebar/Sidebar";
import SidebarSection from "@/components/sidebar/SidebarSection";
import PreviewSidebarItem from "./PreviewSidebarItem";
import KBDPreview from "./core/KBD.preview";
import SpacePreview from "./layouts/Space.preview";
import ColorsPreview from "./layouts/Colors.preview";
import SidebarPreview from "./sidebar/Sidebar.preview";
import TooltipPreview from "./core/Tooltip.preview";
import { usePreviewsStore } from "./previewsStore";
import SwitchPreview from "./core/Switch.preview";
import ButtonGroupPreview from "./core/ButtonGroup.preview";
import ButtonsPreview from "./core/Buttons.preview";
import ButtonGroup from "@/components/core/ButtonGroup";

import ThemeLightIcon from "@/icons/theme-light.svg?react";
import ThemeDarkIcon from "@/icons/theme-dark.svg?react";

function applyColorScheme(colorScheme: "light" | "dark") {
  document.documentElement.classList.remove(colorScheme === "dark" ? "light" : "dark");
  document.documentElement.classList.add(colorScheme === "dark" ? "dark" : "light");
}

export function PreviewsApp() {
  const defaultColorScheme = "light";
  const view = usePreviewsStore((state) => state.view);

  return (
    <>
      <Sidebar>
        <SidebarSection label="components">
          <PreviewSidebarItem view="ButtonGroup" />
          <PreviewSidebarItem view="Buttons" />
          <PreviewSidebarItem view="Tooltip" />
          <PreviewSidebarItem view="KBD" />
          <PreviewSidebarItem view="Sidebar" />
          <PreviewSidebarItem view="Switch" />
        </SidebarSection>
        <SidebarSection label="layouts">
          <PreviewSidebarItem view="Space" />
          <PreviewSidebarItem view="Colors" />
        </SidebarSection>
      </Sidebar>
      <Page className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-400">
        <header className="flex grid-flow-row w-full mb-4 justify-end">
          <ButtonGroup defaultValue={defaultColorScheme} size="xs" onChange={applyColorScheme}>
            <ButtonGroup.Item name="light" icon={ThemeLightIcon} />
            <ButtonGroup.Item name="dark" icon={ThemeDarkIcon} />
          </ButtonGroup>
        </header>
        {view === "ButtonGroup" && <ButtonGroupPreview />}
        {view === "Buttons" && <ButtonsPreview />}
        {view === "Colors" && <ColorsPreview />}
        {view === "KBD" && <KBDPreview />}
        {view === "Sidebar" && <SidebarPreview />}
        {view === "Space" && <SpacePreview />}
        {view === "Switch" && <SwitchPreview />}
        {view === "Tooltip" && <TooltipPreview />}
      </Page>
    </>
  );
}
