import { Home, LogOutIcon, ScrollText, SquarePlus } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from "./ui/sidebar"
import React from "react"
import { useKeycloak } from "../keycloak/KeycloakProvider"

const itemsLagerwart = [
    {
        title: "Neues Inventar erfassen",
        url: "/category/create",
        icon: SquarePlus
    }
]
const itemsAllgemein = [
    {
        title: "Startseite",
        url: "/",
        icon: Home
    },
    {
        title: "Reservierungen",
        url: "/reservations",
        icon: ScrollText
    }
]

export function AppSidebar() {
    const { keycloak, userInfo } = useKeycloak()
    const { open } = useSidebar()

    async function handleLogout() {
        try {
            await keycloak?.logout()
        } catch (e) {
            console.log(e)
        }
    }

    const isInventoryManager = userInfo?.groups?.includes("Inventory-Manager")

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="flex flex-row items-center mb-4 mt-1.5">
                <img
                    src="/equipli-logo.svg"
                    className="w-12 h-auto"
                    alt="equipli logo"
                />
                {open && (
                    <span className="text-2xl text-customBlue font-bold">equipli</span>
                )}
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xl text-customBlue">
                        Allgemein
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {itemsAllgemein.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="bg-customBeige text-customOrange hover:bg-customRed hover:text-customBeige"
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-2"
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                {isInventoryManager && <SidebarGroup>
                    <SidebarGroupLabel className="text-xl text-customBlue">
                        Lagerwart
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {itemsLagerwart.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className="bg-customBeige text-customOrange hover:bg-customRed hover:text-customBeige"
                                    >
                                        <a
                                            href={item.url}
                                            className="flex items-center gap-2"
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>}
            </SidebarContent>

            {/* Footer der Sidebar */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem key={"abmelden"}>
                        <SidebarMenuButton
                            className="bg-customBeige text-customOrange hover:bg-customRed hover:text-customBeige flex items-center gap-2"
                            onClick={handleLogout}
                        >
                            <LogOutIcon />
                            <span>Abmelden</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}
