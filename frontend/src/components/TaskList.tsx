import { Checkbox } from "@/components/ui/checkbox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Trash2 } from "lucide-react";

interface Task {
    id: string;
    body: string;
    completed: boolean;
}

export const TaskList = ({
                             tasks,
                             onToggle,
                             onDelete,
                         }: {
    tasks: Task[];
    onToggle: (id: string) => void;
    onDelete: (id: string) => void;
}) => {
    return (
        <div className="space-y-2">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className={`flex items-center p-3 rounded-lg border ${
                        task.completed ? "bg-green-300 border-green-200" : "bg-white"
                    }`}
                >
                    <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => onToggle(task.id)}
                        className="mr-3"
                    />
                    <span
                        className={`flex-1 text-sm ${
                            task.completed ? "line-through text-gray-500" : "text-gray-800"
                        }`}
                    >
            {task.body}
          </span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(task.id)}
                        className="text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
};