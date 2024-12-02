import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog'
import { TaskForm } from './forms/TaskForm';

export const Task = ({ task, dispatch, onEdit }: { task: Task, dispatch: React.Dispatch<TaskAction>, onEdit: (task: Task) => void }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState<Task | null>(null);
    const handleModalClose = () => {
        setModalOpen(false)
        setIsEdit(null)
    }
    return (
        <div className='rounded-xl shadow-lg p-4 bg-white w-full mx-auto max-w-5xl'>
            <h1 className='text-2xl font-semibold'>{task.title}</h1>
            <p className='text-lg'>{task.message}</p>
            <input
                type="checkbox"
                checked={task.isCompleted}
                onChange={() =>
                    dispatch({ type: "TOGGLE_TASK", payload: task.id })
                }
            />
            <div className='mt-4 flex items-center justify-between'>
                <div className='inline-flex gap-2'>
                    <Button onClick={() => onEdit(task)}>Edit task</Button>
                    <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                        <DialogTrigger asChild >
                            <Button onClick={() => setModalOpen(true)}>Add subtask</Button>
                        </DialogTrigger>
                        <DialogTitle>
                        </DialogTitle>
                        <DialogContent className="sm:max-w-[425px]">
                            <h1 className='font-semibold text-lg'>{isEdit ? "Edit Task" : "Add Task"}</h1>
                            <TaskForm dispatch={dispatch} action={isEdit ? "update" : "create"} task={isEdit} isSubTask={task} setModalOpen={handleModalClose} />
                        </DialogContent>
                    </Dialog>
                    <Button variant={'destructive'} onClick={() => dispatch({ type: "DELETE_TASK", payload: task.id })}>Delete</Button>
                </div>
                <div className='flex flex-col gap-1 mt-4 font-semibold text-gray-400 text-xs'>
                    <p>created at {task.createdAt.toLocaleDateString()} </p>
                    <p>updated at {task.updatedAt.toLocaleDateString()} </p>
                </div>
            </div>

            <div className="space-y-4 mt-4 p-2 ">
                {task.subTasks?.length !== 0 && <h1 className='text-xl text-red-500 font-semibold'>Subtasks</h1>}
                {task.subTasks?.map((subTask) => (
                    <div key={subTask.id} className='border-l-2  border-red-500 pl-6'>
                        <div className="border p-4 rounded">
                            <div className="flex items-center justify-between">
                                <div>
                                    <input
                                        type="checkbox"
                                        checked={subTask.isCompleted}
                                        onChange={() =>
                                            dispatch({ type: "TOGGLE_SUBTASK", payload: { taskId: task.id, subtaskId: subTask.id } })
                                        }
                                    />
                                    <span className="ml-2 font-bold">{subTask.title}</span>
                                    <p>{subTask.message}</p>
                                </div>
                            </div>

                            <div className='inline-flex justify-between w-full mt-4'>
                                <div className='space-x-2'>
                                    <Button onClick={() => {
                                        setIsEdit(subTask)
                                        setModalOpen(true)
                                    }}>Edit task</Button>
                                    <Button variant={'destructive'} onClick={() => dispatch({ type: "DELETE_SUBTASK", payload: { taskId: task.id, subtaskId: subTask.id } })}>Delete</Button>
                                </div>
                                <div className='flex flex-col gap-1 mt-4 font-semibold text-gray-400 text-xs'>
                                    <p>created at {task.createdAt.toLocaleDateString()} </p>
                                    <p>updated at {task.updatedAt.toLocaleDateString()} </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

            </div>
        </div >
    )
}
