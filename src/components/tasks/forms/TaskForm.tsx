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


const formSchema = z.object({
    title: z.string().min(1, "Task title is required."),
    message: z.string().min(1, "Task message is required."),
});

export function TaskForm({
    action,
    dispatch,
    setModalOpen,
    currentTask,
    parentId,
}: {
    action: "update" | "create";
    dispatch: React.Dispatch<TaskAction>;
    setModalOpen: (open: boolean) => void;
    currentTask?: Task | null;
    parentId?: number | null; // If adding/editing a subtask
}) {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: currentTask?.title || "",
            message: currentTask?.message || "",
        },
    });

    async function onSubmit(data: { title: string; message: string }) {
        if (action === "create") {
            const newTask: Task = {
                id: Date.now(),
                title: data.title,
                message: data.message,
                createdAt: new Date(),
                updatedAt: new Date(),
                isCompleted: false,
                subTasks: [],
            };

            if (parentId) {
                dispatch({ type: "ADD_SUBTASK", payload: { taskId: parentId, subTask: newTask } });
            } else {
                dispatch({ type: "ADD_TASK", payload: newTask });
            }
        } else if (currentTask) {
            if (!parentId || parentId !== currentTask.id) {
                dispatch({
                    type: "EDIT_SUBTASK",
                    payload: {
                        taskId: parentId!,
                        subtaskId: currentTask.id,
                        title: data.title,
                        updateDate: new Date(),
                    },
                });
            } else {
                dispatch({
                    type: "EDIT_TASK",
                    payload: {
                        taskId: currentTask.id,
                        title: data.title,
                        updateDate: new Date(),
                    },
                });
            }
        }
        setModalOpen(false);
    }

    return (
        <div className="space-y-8">
            <h1 className="font-semibold text-lg">{currentTask ? "Edit Task" : "Add Task"}</h1>
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
                                    <Input placeholder="Enter task message" {...field} />
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

