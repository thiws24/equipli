import React from "react"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { useKeycloak } from "../keycloak/KeycloakProvider"
import QrReader from "./QrReader"
import { AppSidebar } from "./App-sidebar"

interface Props {
    children: React.ReactNode
}

export const Layout: React.FC<Props> = ({ children }) => {
    const [showQrReader, setShowQrReader] = React.useState(false)
    const { authenticated } = useKeycloak()
    if (!authenticated) {
        return <div />
    }
    return (
        <SidebarProvider defaultOpen={false}>
            <div className="flex h-screen w-full">
                <div className="h-full z-50">
                    <AppSidebar />
                </div>
                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-white p-2.5 flex items-center justify-between shadow-md">
                        <SidebarTrigger />

                        <button
                            className="text-sm bg-customBlue text-customBeige px-4 py-2 rounded hover:bg-customRed"
                            onClick={() => setShowQrReader(true)}
                        >
                            {" "}
                            QR Code scannen
                        </button>
                    </div>
                    {/* Main Content */}
                    <main className="flex flex-col h-screen overflow-auto">
                        {children}
                    </main>
                </div>
                {/* QR Code Reader Modal */}{" "}
                {showQrReader && (
                    <div className="fixed inset-0 bg-customBlack bg-opacity-50 flex justify-center items-center z-10">
                        <div className="bg-customBeige p-4 rounded-lg shadow-lg relative">
                            <button
                                className="absolute top-4 right-6 text-customRed text-5xl hover:text-customBlack z-20"
                                onClick={() => setShowQrReader(false)}
                            >
                                &times;
                            </button>
                            <QrReader />
                        </div>
                    </div>
                )}
            </div>
        </SidebarProvider>
    )
}
