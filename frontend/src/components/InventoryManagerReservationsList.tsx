import * as React from "react"
import { useKeycloak } from "../keycloak/KeycloakProvider"
import { TaskProps } from "../interfaces/TaskProps"
import { fetchOpenTasksByTaskName } from "../services/fetchTasks"
import CustomToasts from "./CustomToasts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "./ui/card"
import { ConfirmReservationCard } from "./ConfirmReservationCard"
import { ConfirmReturnCard } from "./ConfirmReturnCard"
import { fetchProcessesByLastMilestone } from "../services/fetchProcesses"
import { Process } from "../interfaces/Process"
import { Skeleton } from "./ui/skeleton"
import { CalendarOff, MessageCircleQuestion, Undo2 } from "lucide-react"

export const InventoryManagerReservationsList: React.FC = () => {
    const [confirmTasks, setConfirmTasks] = React.useState<TaskProps[]>([])
    const [returnTasks, setReturnTasks] = React.useState<Process[]>([])
    const { token } = useKeycloak()

    const [loadingToConfirm, setLoadingToConfirm] = React.useState(true)
    const [loadingToReturn, setLoadingToReturn] = React.useState(true)

    async function fetchToConfirmProcesses() {
        try {
            const tasks: TaskProps[] = await fetchOpenTasksByTaskName(
                "Receive Inventory Manager confirmation",
                token ?? "",
                "reservationrequests"
            )
            setConfirmTasks(tasks)
        } catch (e) {
            CustomToasts.error({
                message:
                    "Es ist ein Fehler beim Laden der Reservierungen aufgetreten."
            })
        }
        setLoadingToConfirm(false)
    }

    async function fetchToReturnProcesses() {
        try {
            const tasks: Process[] = await fetchProcessesByLastMilestone(
                "InventoryItem has been returned",
                token ?? "",
                "activereservations"
            )
            setReturnTasks(tasks)
        } catch (e) {
            CustomToasts.error({
                message:
                    "Es ist ein Fehler beim Laden der Rückgaben aufgetreten."
            })
        }
        setLoadingToReturn(false)
    }

    const handleConfirmReservation = async (
        processId: number,
        guid: string
    ) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SPIFF}/api/v1.0/tasks/${processId}/${guid}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reservation_confirmation: "confirmed"
                    })
                }
            )

            if (response.ok) {
                CustomToasts.success({
                    message: "Reservierung bestätigt.",
                    duration: 1000,
                    onClose: () => window.location.reload()
                })
            } else {
                CustomToasts.error({
                    message: "Es ist ein Fehler aufgetreten."
                })
            }
        } catch (error) {
            CustomToasts.error({
                message:
                    "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
            })
        }
    }

    const handleCancelReservation = async (processId: number, guid: string) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SPIFF}/api/v1.0/tasks/${processId}/${guid}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reservation_confirmation: "not confirmed"
                    })
                }
            )

            if (response.ok) {
                CustomToasts.success({
                    message: "Reservierung abgelehnt.",
                    duration: 1000,
                    onClose: () => window.location.reload()
                })
            } else {
                CustomToasts.error({
                    message: "Es ist ein Fehler aufgetreten."
                })
            }
        } catch (error) {
            CustomToasts.error({
                message:
                    "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
            })
        }
    }

    const handleConfirmReturn = async (reservationId: number) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SPIFF}/api/v1.0/messages/check_in_inventoryitem_1`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        reservation_id: reservationId,
                        check_in_status: "OK"
                    })
                }
            )

            if (response.ok) {
                CustomToasts.success({
                    message: "Rückgabe erfolgreich bestätigt.",
                    duration: 1000,
                    onClose: () => window.location.reload()
                })
            } else {
                CustomToasts.error({
                    message: "Es ist ein Fehler aufgetreten."
                })
            }
        } catch (error) {
            CustomToasts.error({
                message:
                    "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
            })
        }
    }

    React.useEffect(() => {
        void fetchToConfirmProcesses()
        void fetchToReturnProcesses()
    }, [])

    return (
        <div>
            <Card className="bg-white border-none drop-shadow-2xl my-10">
                <CardHeader>
                    <CardTitle>Reservierungsanfragen</CardTitle>
                    <CardDescription>
                        {loadingToConfirm ? (
                            <Skeleton className="h-2 bg-gray-200 w-2/4 mt-2" />
                        ) : (
                            <span>
                                {confirmTasks.length} Reservierungsanfragen
                                ausstehend
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>

                {loadingToConfirm && (
                    <CardContent>
                        <div className="space-y-4">
                            <Card className="flex flex-col space-y-4 p-4">
                                <Skeleton className="h-4 bg-gray-200 w-3/4" />
                                <Skeleton className="h-3 bg-gray-200 w-2/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                            </Card>
                            <Card className="flex flex-col space-y-4 p-4">
                                <Skeleton className="h-4 bg-gray-200 w-3/4" />
                                <Skeleton className="h-3 bg-gray-200 w-2/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                            </Card>
                        </div>
                    </CardContent>
                )}

                <CardContent>
                    <div className="space-y-5">
                        {confirmTasks.length === 0 && !loadingToConfirm && (
                            <div className="text-center mt-20 mb-20">
                                <MessageCircleQuestion className="w-8 h-8 text-gray-800 mx-auto mb-4" />
                                <p className="text-lg text-gray-800 mb-4">
                                    Keine Reservierungsanfragen offen
                                </p>
                            </div>
                        )}

                        {confirmTasks.map((cp) => (
                            <ConfirmReservationCard
                                key={cp.process_instance_id}
                                processId={cp.process_instance_id}
                                guid={cp.task_guid}
                                userName={cp.userName}
                                data={cp.dataObject}
                                onConfirmReservation={handleConfirmReservation}
                                onCancelReservation={handleCancelReservation}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-white border-none drop-shadow-2xl my-10">
                <CardHeader>
                    <CardTitle>Rückgaben</CardTitle>
                    <CardDescription>
                        {loadingToReturn ? (
                            <Skeleton className="h-2 bg-gray-200 w-2/4 mt-2" />
                        ) : (
                            <span>
                                {returnTasks.length} Rückgaben ausstehend
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>

                {loadingToConfirm && (
                    <CardContent>
                        <div className="space-y-4">
                            <Card className="flex flex-col space-y-4 p-4">
                                <Skeleton className="h-4 bg-gray-200 w-3/4" />
                                <Skeleton className="h-3 bg-gray-200 w-2/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                            </Card>
                            <Card className="flex flex-col space-y-4 p-4">
                                <Skeleton className="h-4 bg-gray-200 w-3/4" />
                                <Skeleton className="h-3 bg-gray-200 w-2/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                                <Skeleton className="h-3 bg-gray-200 w-1/4" />
                            </Card>
                        </div>
                    </CardContent>
                )}

                <CardContent>
                    <div className="space-y-5">
                        {returnTasks.length === 0 && !loadingToReturn && (
                            <div className="text-center mt-20 mb-20">
                                <Undo2 className="w-8 h-8 text-gray-800 mx-auto mb-4" />
                                <p className="text-lg text-gray-800 mb-4">
                                    Keine Rückgaben offen
                                </p>
                            </div>
                        )}
                        {returnTasks.map((cp) => (
                            <ConfirmReturnCard
                                key={cp.id}
                                processId={cp.id}
                                data={cp.dataObject}
                                onConfirmReturn={handleConfirmReturn}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
