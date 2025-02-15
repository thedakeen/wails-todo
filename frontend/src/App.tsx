import { useEffect, useState } from 'react'
import { GetAllTasks, AddTask, ToggleTask } from '../wailsjs/go/main/App'
import { main } from '../wailsjs/go/models'
import AddTaskForm from '@/components/AddTaskForm'
import TaskList from '@/components/TaskList'
import { AlarmClock } from 'lucide-react'
import { parseISO, isBefore } from 'date-fns'



type Task = main.Task

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')
    const [deadline, setDeadline] = useState<Date>(new Date())
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        GetAllTasks().then(tasks => {
            setTasks(tasks)
            setLoading(false)
        }).catch(console.error)
    }, [])

    const handleAddTask = async () => {
        if (!newTask.trim()) return

        try {
            const task = await AddTask(newTask, deadline)
            setTasks([task, ...tasks])
            setNewTask('')
            setDeadline(new Date())
        } catch (error) {
            console.error('Error adding task:', error)
        }
    }

    const handleToggleTask = async (id: number) => {
        try {
            const updatedTask = await ToggleTask(id)
            setTasks(tasks.map(task =>
                task.id === updatedTask.id ? updatedTask : task
            ))
        } catch (error) {
            console.error('Error toggling task:', error)
        }
    }

    const getTaskStatus = (task: Task) => {
        if (task.done) return 'completed'

        const deadlineDate = (parseISO(task.deadline as string))
        const now = new Date()

        return isBefore(deadlineDate, now) ? 'overdue' : 'pending'
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <AlarmClock className="w-6 h-6 text-blue-600" />
                        Todo App
                    </h1>

                    <AddTaskForm
                        title={newTask}
                        deadline={deadline}
                        onTitleChange={setNewTask}
                        onDeadlineChange={setDeadline}
                        onSubmit={handleAddTask}
                    />

                    {loading ? (
                        <div className="text-center text-gray-500">Loading tasks...</div>
                    ) : (
                        <TaskList
                            tasks={tasks}
                            getStatus={getTaskStatus}
                            onToggle={handleToggleTask}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}