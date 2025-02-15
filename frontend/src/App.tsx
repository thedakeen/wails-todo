import { useState } from "react";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskList } from "./components/TaskList";

interface Task {
    id: string;
    body: string;
    completed: boolean;
}

export default function App() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: "1", body: "Изучить React", completed: false },
        { id: "2", body: "Написать To-Do приложение", completed: true },
    ]);

    const handleAdd = (body: string) => {
        const newTask = {
            id: Date.now().toString(),
            body,
            completed: false,
        };
        setTasks([...tasks, newTask]);
    };

    const handleToggle = (id: string) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDelete = (id: string) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">To-Do List</h1>
            <AddTaskForm onAdd={handleAdd} />
            <TaskList
                tasks={tasks}
                onToggle={handleToggle}
                onDelete={handleDelete}
            />
        </div>
    );
}