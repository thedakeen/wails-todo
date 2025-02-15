import TaskItem from './TaskItem'
import { main } from '../../wailsjs/go/models'

type Task = main.Task

export default function TaskList({
                                     tasks,
                                     getStatus,
                                     onToggle,
                                     onDelete,
                                 }: {
    tasks: Task[]
    getStatus: (task: Task) => 'completed' | 'overdue' | 'pending'
    onToggle: (id: number) => void
    onDelete: (id: number) => void
}) {
    return (
        <div className="space-y-2">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    status={getStatus(task)}
                    onToggle={() => onToggle(task.id)}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}