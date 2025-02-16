import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useState } from "react"
import PrioritySelector from "@/components/PrioritySelector"

export default function AddTaskForm({
                                        title,
                                        deadline,
                                        priority,
                                        onTitleChange,
                                        onDeadlineChange,
                                        onPriorityChange,
                                        onSubmit
                                    }: {
    title: string
    deadline: Date
    priority: number
    onTitleChange: (value: string) => void
    onDeadlineChange: (date: Date) => void
    onPriorityChange: (value: number) => void
    onSubmit: () => void
}) {
    const [openCalendar, setOpenCalendar] = useState(false)

    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex gap-2">
                <Input
                    value={title}
                    onChange={(e) => onTitleChange(e.target.value)}
                    placeholder="Add new task..."
                    onKeyUp={(e) => e.key === 'Enter' && onSubmit()}
                    className="flex-1"
                />

                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-[240px] justify-start">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {format(deadline, 'PPP')}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={deadline}
                            onSelect={(date) => {
                                if (date) {
                                    onDeadlineChange(date)
                                    setOpenCalendar(false)
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>

                <Button onClick={onSubmit}>Add Task</Button>
            </div>

            <PrioritySelector
                priority={priority}
                setPriority={onPriorityChange}
            />
        </div>
    )
}