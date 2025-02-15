import { CheckCircle2, Circle, CalendarIcon } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { main } from '../../wailsjs/go/models'

type Task = main.Task

export default function TaskItem({
                                     task,
                                     onToggle,
                                     status
                                 }: {
    task: Task
    onToggle: () => void
    status: 'completed' | 'overdue' | 'pending'
}) {
    return (
        <div className={`p-4 rounded-lg transition-colors flex items-center gap-4
      ${status === 'completed' ? 'bg-green-50' :
            status === 'overdue' ? 'bg-red-50' : 'bg-gray-50'}
      ${status === 'completed' ? 'opacity-75' : 'hover:bg-opacity-75'}`}
        >
            <button
                onClick={onToggle}
                className="text-blue-600 hover:text-blue-800 transition-colors"
            >
                {task.done ? (
                    <CheckCircle2 className="w-6 h-6" />
                ) : (
                    <Circle className="w-6 h-6" />
                )}
            </button>

            <div className="flex-1">
                <p className={`${task.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <CalendarIcon className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-500">
  Deadline: {format(parseISO(task.deadline as string), 'MMM dd, yyyy')}
          </span>
                    {task.done && task.doneAt && (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-600">
    Completed: {format(parseISO(task.doneAt as string), 'MMM dd, yyyy')}
              </span>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}