type Task = {
  id: number;
  title: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
  subTasks?: {
    id: number;
    title: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
    isCompleted: boolean;
  }[];
};

type TaskAction =
  | { type: "ADD_TASK"; payload: Task }
  | { type: "TOGGLE_TASK"; payload: number }
  | { type: "TOGGLE_SUBTASK"; payload: { taskId: number; subtaskId: number } }
  | {
      type: "EDIT_TASK";
      payload: { taskId: number; title: string; updateDate: Date };
    }
  | { type: "DELETE_TASK"; payload: number }
  | {
      type: "EDIT_SUBTASK";
      payload: {
        taskId: number;
        subtaskId: number;
        title: string;
        updateDate: Date;
      };
    }
  | { type: "ADD_SUBTASK"; payload: { taskId: number; subTask: Task } }
  | { type: "TOGGLE_SUBTASK"; payload: { taskId: number; subtaskId: number } }
  | { type: "DELETE_SUBTASK"; payload: { taskId: number; subtaskId: number } };
