import { ReservationItemProps } from "./ReservationItemProps"

export interface ProcessDataValueProps extends ReservationItemProps {
    id: number
    userId: string
    userName: string
    itemId: number
    categoryId: number
    status?: string
    lendingStatus?: string
}
