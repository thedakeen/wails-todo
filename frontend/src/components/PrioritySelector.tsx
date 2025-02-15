import { Button } from "@/components/ui/button"

export default function PrioritySelector({
                                             priority,
                                             setPriority
                                         }: {
    priority: number
    setPriority: (value: number) => void
}) {
    return (
        <div className="flex gap-1">
            <Button
                variant={priority === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setPriority(1)}
                className={priority === 1 ? "bg-red-500 hover:bg-red-600" : ""}
            >
                High
            </Button>
            <Button
                variant={priority === 2 ? "default" : "outline"}
                size="sm"
                onClick={() => setPriority(2)}
                className={priority === 2 ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
                Medium
            </Button>
            <Button
                variant={priority === 3 ? "default" : "outline"}
                size="sm"
                onClick={() => setPriority(3)}
                className={priority === 3 ? "bg-green-500 hover:bg-green-600" : ""}
            >
                Low
            </Button>
        </div>
    )
}