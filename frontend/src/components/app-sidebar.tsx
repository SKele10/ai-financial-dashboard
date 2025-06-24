import * as React from "react"
import {
  AudioWaveform,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  BrainCircuit,
  ChartBar,
  Command,
  Frame,
  GalleryVerticalEnd,
  RollerCoaster,
  Settings2,
  Shirt,
  SquareTerminal,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "Guest",
    email: "shoaibkalawant@demo.com",
    avatar: "/avatar.png",
  },
  projects: [
    {
      name: "Charts",
      url: "/charts",
      icon: BarChart3,
    },
    {
      name: "Predictions",
      url: "/predictions",
      icon: Brain,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <RollerCoaster className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Charts AI</span>
                  <span className="">v0.0.1 (Demo)</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* <NavMain items={data.navMain} /> */}
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
