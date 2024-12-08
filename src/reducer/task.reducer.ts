export function taskReducer(
  state: { tasks: Task[] },
  action: TaskAction
): { tasks: Task[] } {
  const addSubtaskRecursively = (
    tasks: Task[],
    taskId: number,
    subTask: Task
  ): Task[] =>
    tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            subTasks: [...(task.subTasks || []), subTask],
          }
        : {
            ...task,
            subTasks: addSubtaskRecursively(task.subTasks, taskId, subTask),
          }
    );

  const toggleSubtaskRecursively = (tasks: Task[], taskId: number): Task[] =>
    tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            isCompleted: !task.isCompleted,
            subTasks: toggleSubtaskRecursively(task.subTasks, taskId),
          }
        : {
            ...task,
            subTasks: toggleSubtaskRecursively(task.subTasks, taskId),
          }
    );

  const editSubtaskRecursively = (
    tasks: Task[],
    taskId: number,
    updatedData: Partial<Task>
  ): Task[] =>
    tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            ...updatedData,
            subTasks: editSubtaskRecursively(
              task.subTasks,
              taskId,
              updatedData
            ),
          }
        : {
            ...task,
            subTasks: editSubtaskRecursively(
              task.subTasks,
              taskId,
              updatedData
            ),
          }
    );

  const deleteSubtaskRecursively = (tasks: Task[], taskId: number): Task[] =>
    tasks
      .map((task) => {
        if (task.id === taskId) return null;

        return {
          ...task,
          subTasks: task.subTasks
            ? deleteSubtaskRecursively(task.subTasks, taskId)
            : [],
        };
      })
      .filter(Boolean) as Task[]; // Filter out the null values

  switch (action.type) {
    case "ADD_TASK":
      return { ...state, tasks: [...state.tasks, action.payload] };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? {
                ...task,
                isCompleted: !task.isCompleted,
                subTasks: task.subTasks?.map((sub) => ({
                  ...sub,
                  isCompleted: !task.isCompleted,
                })),
              }
            : task
        ),
      };

    case "TOGGLE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((task) => {
          if (task.id === action.payload.taskId) {
            const updatedSubTasks = toggleSubtaskRecursively(
              task.subTasks,
              action.payload.subtaskId
            );

            const allSubtasksCompleted = updatedSubTasks?.every(
              (sub) => sub.isCompleted
            );

            return {
              ...task,
              subTasks: updatedSubTasks,
              isCompleted: allSubtasksCompleted ?? false,
            };
          }
          return task;
        }),
      };

    case "EDIT_TASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? {
                ...task,
                title: action.payload.title,
                updatedAt: action.payload.updateDate,
              }
            : task
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };

    case "ADD_SUBTASK":
      return {
        ...state,
        tasks: addSubtaskRecursively(
          state.tasks,
          action.payload.taskId,
          action.payload.subTask
        ),
      };

    case "EDIT_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subTasks: editSubtaskRecursively(
                  task.subTasks,
                  action.payload.subtaskId,
                  {
                    title: action.payload.title,
                    updatedAt: action.payload.updateDate,
                  }
                ),
              }
            : task
        ),
      };

    case "DELETE_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subTasks: deleteSubtaskRecursively(
                  task.subTasks,
                  action.payload.subtaskId
                ),
              }
            : task
        ),
      };

    default:
      return state;
  }
}
