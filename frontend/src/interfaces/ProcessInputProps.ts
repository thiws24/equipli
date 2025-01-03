import { ReservationItemProps } from "./ReservationItemProps"

export interface ProcessInputProps extends ReservationItemProps {
    userId: string
    itemId: number
    count: number
    categoryId: number
}
