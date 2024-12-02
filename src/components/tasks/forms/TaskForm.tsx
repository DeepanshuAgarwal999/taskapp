import React, { useEffect, useReducer, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Task = {
    id: number;
    title: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    isCompleted: boolean;
    subTasks?: Task[];
};

const formSchema = z.object({
    title: z.string().min(1, "Task title is required."),
    message: z.string().min(1, "Task message is required."),
});

export function TaskForm({ dispatch, action, task, isSubTask = null, setModalOpen }: { dispatch: React.Dispatch<TaskAction>, action: "update" | "create", task?: Task | null, isSubTask?: Task | null, setModalOpen: (open: boolean) => void }) {


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            message: "",
        },
    });
    useEffect(() => {
        if (action === "update" && task) {
            form.reset({
                title: task.title,
                message: task.message
            });

        }
    }, [action, task]);

    function onSubmit(data: { title: string; message: string }) {
        if (action === "create") {
            if (isSubTask) {
                const newTask: Task = {
                    id: Date.now(),
                    title: data.title,
                    message: data.message,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isCompleted: false,
                };
                dispatch({ type: "ADD_SUBTASK", payload: { taskId: isSubTask!.id, subTask: newTask } });
            }
            else {
                const newTask: Task = {
                    id: Date.now(),
                    title: data.title,
                    message: data.message,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    isCompleted: false,
                    subTasks: [],
                };
                dispatch({ type: "ADD_TASK", payload: newTask });
            }
        }
        else {
            if (isSubTask) {
                console.log(task)
                dispatch({ type: "EDIT_SUBTASK", payload: { taskId: isSubTask!.id, subtaskId: task!.id, title: data.title, updateDate: new Date() } });
            }
            else {
                dispatch({ type: "EDIT_TASK", payload: { taskId: task!.id, title: data.title, updateDate: new Date() } });
            }
        }
        form.reset()
        setModalOpen(false)
    }

    return (
        <div className="space-y-8">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Task Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter task title" {...field} />
                                </FormControl>
                                <FormDescription>Add the title of your task.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Task Message</FormLabel>
                                <FormControl>
                                    <Input readOnly={action === "update"} placeholder="Enter task message" {...field} className={action === "update" ? "bg-gray-100 text-gray-900 pointer-event-none cursor-not-allowed" : "bg-transparent text-gray-700"} />
                                </FormControl>
                                <FormDescription>Add the message for your task.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit">{action === "create" ? "Add Task" : "Update Task"}</Button>
                </form>
            </Form>


        </div>
    );
}
