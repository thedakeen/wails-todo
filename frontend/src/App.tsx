import { useEffect, useState } from 'react'
import { GetAllTasks, AddTask, ToggleTask, DeleteTask } from '../wailsjs/go/main/App'
import { main } from '../wailsjs/go/models'
import AddTaskForm from '@/components/AddTaskForm'
import TaskList from '@/components/TaskList'
import { AlarmClock, CheckCircle, ListTodo } from 'lucide-react'
import { parseISO, isBefore } from 'date-fns'




type Task = main.Task

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [newTask, setNewTask] = useState('')
    const [deadline, setDeadline] = useState<Date>(new Date())
    const [priority, setPriority] = useState<number>(2)
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
            const task = await AddTask(newTask, deadline, priority)
            setTasks([task, ...tasks])
            setNewTask('')
            setDeadline(new Date())
            setPriority(2)
        } catch (error) {
            let errorMessage = 'Invalid deadline'
            if (error instanceof Error) {
                if (error.message.includes('invalid deadline')) {
                    errorMessage = 'Please select a future date'
                } else if (error.message.includes('title cannot be empty')) {
                    errorMessage = 'Please enter a task description'
                }
            }

            alert(errorMessage)
            }
        }

    const handleDeleteTask = async (id: number) => {
        try {
            await DeleteTask(id) // Make sure this matches your Go method name
            setTasks(prev => prev.filter(task => task.id !== id))
        } catch (error) {
            console.error('Delete failed:', error)
            alert('Failed to delete task')
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

    const activeTasks = tasks.filter(task => !task.done)
    const completedTasks = tasks.filter(task => task.done)

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                        <AlarmClock className="w-6 h-6 text-blue-600" />
                        Todo List
                    </h1>

                    <AddTaskForm
                        title={newTask}
                        deadline={deadline}
                        priority={priority}
                        onTitleChange={setNewTask}
                        onDeadlineChange={setDeadline}
                        onPriorityChange={setPriority}
                        onSubmit={handleAddTask}
                    />
                    {loading ? (
                        <div className="text-center text-gray-500">Loading tasks...</div>
                    ) : (
                        <div className="space-y-8">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-gray-700">
                                    <ListTodo className="w-5 h-5" />
                                    <h2 className="text-lg font-semibold">
                                        Active Tasks ({activeTasks.length})
                                    </h2>
                                </div>
                                <TaskList
                                    tasks={activeTasks}
                                    getStatus={getTaskStatus}
                                    onToggle={handleToggleTask}
                                    onDelete={handleDeleteTask}
                                />
                            </div>

                            {completedTasks.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4 text-gray-500">
                                        <CheckCircle className="w-5 h-5" />
                                        <h2 className="text-lg font-semibold">
                                            Completed Tasks ({completedTasks.length})
                                        </h2>
                                    </div>
                                    <TaskList
                                        tasks={completedTasks}
                                        getStatus={() => 'completed'}
                                        onToggle={handleToggleTask}
                                        onDelete={handleDeleteTask}
                                    />
                                </div>
                                )}
                        </div>
                        )}
                </div>
            </div>
        </div>
    )
}