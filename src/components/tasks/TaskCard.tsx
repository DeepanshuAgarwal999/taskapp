import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '../ui/dialog';
import { TaskForm } from './forms/TaskForm';
import { Button } from '../ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Checkbox } from '../ui/checkbox';

export const TaskCard = ({ task, dispatch }: { task: Task; dispatch: React.Dispatch<TaskAction> }) => {
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [currentSubtask, setCurrentSubtask] = React.useState<Task | null>(null);

    const handleAddSubtask = () => {
        setModalOpen(true);
        setCurrentSubtask(null); // Ensure the modal is for adding a new subtask
    };

    const handleEditSubtask = (subtask: Task,) => {
        setModalOpen(true);
        setCurrentSubtask(subtask);
    };


    const handleDeleteSubtask = (subtaskId: number) => {
        dispatch({
            type: 'DELETE_SUBTASK',
            payload: { taskId: task.id, subtaskId },
        });
    };
    const handleToggleSubtask = (subtaskId: number) => {
        dispatch({
            type: 'TOGGLE_SUBTASK',
            payload: { taskId: task.id, subtaskId },
        });
    };

    const renderSubtasks = (subtasks: Task[] = []) => {
        return (
            <div className="ml-4">
                {subtasks.map((subtask) => (
                    <div key={subtask.id} className="border-l-2 border-gray-300 pl-4 my-2">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value={subtask.id.toString()}>
                                <AccordionTrigger>
                                    {subtask.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className='inline-flex gap-2'>
                                        <Checkbox checked={subtask.isCompleted} onCheckedChange={() => handleToggleSubtask(subtask.id)} />
                                        <p>{subtask.message}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => handleEditSubtask(subtask)}
                                        >
                                            Edit Subtask
                                        </Button>
                                        <Button
                                            variant="outline"
                                            color="red"
                                            onClick={() => handleDeleteSubtask(subtask.id)}
                                        >
                                            Delete Subtask
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleAddSubtask()} // Add subtask to this subtask
                                        >
                                            Add Subtask
                                        </Button>
                                    </div>
                                    {renderSubtasks(subtask.subTasks)}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="border p-8 min-w-sm">
            <Accordion type="single" collapsible className="w-full min-w-sm">
                <AccordionItem value={task.id.toString()}>
                    <AccordionTrigger>
                        {task.title}
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className='inline-flex gap-2'>
                            <Checkbox checked={task.isCompleted} onCheckedChange={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })} />
                            {task.message}
                        </div>
                        <div className="flex space-x-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => handleAddSubtask()} // Add subtask to the main task
                            >
                                Add Subtask
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleEditSubtask(task)} // Edit main task
                            >
                                Edit Task
                            </Button>
                            <Button
                                variant="outline"
                                color="red"
                                onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                            >
                                Delete Task
                            </Button>
                        </div>
                        {renderSubtasks(task.subTasks)} {/* Render subtasks */}
                        <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogTitle>
                                    {currentSubtask ? 'Edit Subtask' : 'Add Subtask'}
                                </DialogTitle>
                                <TaskForm
                                    dispatch={dispatch}
                                    setModalOpen={setModalOpen}
                                    action={currentSubtask ? 'update' : 'create'}
                                    currentTask={currentSubtask || task}
                                    parentId={task.id}
                                />
                            </DialogContent>
                        </Dialog>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
};
