import React, { useReducer, useState } from 'react'
import { TaskForm } from './components/tasks/forms/TaskForm'
import { taskReducer } from './reducer/task.reducer';
import { Task } from './components/tasks/Task';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Button } from './components/ui/button';

const initialState = {
  tasks: [] as Task[],
};

const App = () => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState<Task | null>(null);

  const handleEdit = (task: Task) => {
    setModalOpen(true)
    setIsEdit(task)
  }
  return (
    <section className='container p-6'>
      <header className='flex items-center justify-between my-=-098r5e43wq21  '>
        <p>{new Date().toLocaleDateString()}</p>
        <h1 className='font-semibold text-2xl text-center'>Tasks</h1>
        <p className='text-lg font-semibold'>Total tasks {state.tasks.length}</p>
      </header>
      <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild >
          <Button variant="outline" onClick={() => {
            setIsEdit(null)
          }}>Add task</Button>
        </DialogTrigger>
        <DialogTitle>
        </DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <h1 className='font-semibold text-lg'>{isEdit ? "Edit Task" : "Add Task"}</h1>
          <TaskForm dispatch={dispatch} action={isEdit ? "update" : "create"} task={isEdit} setModalOpen={setModalOpen}/>
        </DialogContent>
      </Dialog>
      {
        state.tasks.length === 0 && <h1 className='text-xl font-bold text-center'>No Tasks found</h1>
      }
      <div className='flex flex-col gap-4 items-center justify-center mt-10'>
        {state.tasks.map((task) => (
          <Task key={task.id} task={task} dispatch={dispatch} onEdit={handleEdit} />
        ))}
      </div>
    </section>
  )
}

export default App