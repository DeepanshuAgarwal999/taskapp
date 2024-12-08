import React, { useReducer, useState } from 'react'
import { TaskForm } from './components/tasks/forms/TaskForm'
import { taskReducer } from './reducer/task.reducer';
import { TaskCard } from './components/tasks/TaskCard';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Button } from './components/ui/button';

const initialState = {
  tasks: [] as Task[],
};

const App = () => {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [isModalOpen, setModalOpen] = useState(false);
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
            setModalOpen(true)
          }}>Add task</Button>
        </DialogTrigger>
        <DialogTitle>
        </DialogTitle>
        <DialogContent className="sm:max-w-[425px]">
          <TaskForm dispatch={dispatch} setModalOpen={setModalOpen} action='create' currentTask={null} />
        </DialogContent>
      </Dialog>
      {
        state.tasks.length === 0 && <h1 className='text-xl font-bold text-center'>No Tasks found</h1>
      }
      <div className='flex flex-col gap-4 items-center justify-center mt-10'>
        {state.tasks.map((task) => (
          <TaskCard key={task.id} task={task} dispatch={dispatch} />
        ))}
      </div>
    </section>
  )
}

export default App