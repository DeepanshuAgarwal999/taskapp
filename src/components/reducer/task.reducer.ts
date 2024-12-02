export function taskReducer(
  state: { tasks: Task[] },
  action: TaskAction
): { tasks: Task[] } {
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
            const updatedSubTasks = task.subTasks?.map((sub) =>
              sub.id === action.payload.subtaskId
                ? { ...sub, isCompleted: !sub.isCompleted }
                : sub
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

    // subtask actions
    case "ADD_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subTasks: [...(task.subTasks || []), action.payload.subTask],
              }
            : task
        ),
      };
    case "EDIT_SUBTASK":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.taskId
            ? {
                ...task,
                subTasks: task.subTasks?.map((sub) =>
                  sub.id === action.payload.subtaskId
                    ? {
                        ...sub,
                        title: action.payload.title,
                        updatedAt: action.payload.updateDate,
                      }
                    : sub
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
                subTasks: task.subTasks?.filter(
                  (sub) => sub.id !== action.payload.subtaskId
                ),
              }
            : task
        ),
      };

    default:
      return state;
  }
}
