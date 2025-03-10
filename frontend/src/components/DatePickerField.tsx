import { FormControl, FormItem, FormMessage, FormDescription } from "./ui/form"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover"
import { CalendarDays, CalendarIcon, CalendarX } from "lucide-react"
import { cn } from "../lib/utils"
import { format } from "date-fns"
import React, { useState } from "react"

interface DatePickerFieldProps {
    label: string
    description?: string
    field: any
    disabledDays?: any[]
    defaultMonth?: Date
    required?: boolean
    isDisabled?: boolean
    onDayClick?: () => void
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
    label,
    description,
    field,
    disabledDays,
    defaultMonth,
    isDisabled,
    onDayClick
}) => {
    const [popoverOpen, setPopoverOpen] = useState(false)

    return (
        <FormItem className="flex flex-col">
            <div className="flex flex-col sm:justify-center ml-8 mr-8">
                {description && (
                    <FormDescription>{description}</FormDescription>
                )}
                <div className="flex items-center pb-2 ">
                    <CalendarDays className="w-4 h-4 mr-2 text-customOrange" />
                    <label className="text-sm font-bold">{label}</label>
                </div>

                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                data-testid={`${label.toLowerCase()}Button`}
                                variant={"outline"}
                                className={cn(
                                    "w-[160px] pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                disabled={isDisabled}
                            >
                                {field.value ? (
                                    format(field.value, "dd. MMM yyyy")
                                ) : (
                                    <span>Datum wählen</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    {!isDisabled && (
                        <PopoverContent
                            className="w-auto p-0 max-h-[320px] overflow-y-auto"
                            side="top"
                            align="center"
                            collisionPadding={10}
                            avoidCollisions={false}
                        >
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                    field.onChange(date)
                                    setPopoverOpen(false)
                                }}
                                disabled={disabledDays}
                                defaultMonth={defaultMonth}
                                onDayClick={onDayClick}
                            />
                        </PopoverContent>
                    )}
                </Popover>
                <FormMessage />
            </div>
        </FormItem>
    )
}

export default DatePickerField
