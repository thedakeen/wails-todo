import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { PlusCircle } from "lucide-react";

export const AddTaskForm = ({ onAdd }: { onAdd: (title: string) => void }) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            onAdd(input.trim());
            setInput("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
            <Input
                placeholder="Add a new task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
            />
            <Button type="submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add
            </Button>
        </form>
    );
};