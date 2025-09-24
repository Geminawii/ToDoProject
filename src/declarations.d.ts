declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.jpeg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

declare module "@/components/ui/avatar" {
  export const Avatar: any;
  export const AvatarImage: any;
  export const AvatarFallback: any;
}

declare module "@/components/ui/card" {
  import * as React from "react";
  export const Card: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>>;
  export const CardHeader: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>>;
  export const CardContent: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>>;
}

declare module "@/components/ui/button" {
  import * as React from "react";
  export const Button: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>> & { variant?: string; size?: string }>;
}

declare module "@/components/ui/progress" {
  import * as React from "react";
  export const Progress: React.FC<React.PropsWithChildren<{ value?: number }>>;
}

declare module "@/components/ui/dialog" {
  import * as React from "react";
  export const Dialog: React.FC<React.PropsWithChildren>;
  export const DialogTrigger: React.FC<React.PropsWithChildren>;
  export const DialogContent: React.FC<React.PropsWithChildren>;
  export const DialogClose: React.FC<React.PropsWithChildren>;
  export const DialogHeader: React.FC<React.PropsWithChildren>;
  export const DialogFooter: React.FC<React.PropsWithChildren>;
  export const DialogTitle: React.FC<React.PropsWithChildren>;
  export const DialogDescription: React.FC<React.PropsWithChildren>;
}

declare module "@/components/ui/dialog" {
  import * as React from "react";

  type DialogProps = React.PropsWithChildren<{
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
  }>;

  export const Dialog: React.FC<DialogProps>;
  export const DialogTrigger: React.FC<React.PropsWithChildren<{ asChild?: boolean }>>;
  export const DialogContent: React.FC<React.PropsWithChildren>;
  export const DialogClose: React.FC<React.PropsWithChildren>;
  export const DialogHeader: React.FC<React.PropsWithChildren>;
  export const DialogFooter: React.FC<React.PropsWithChildren>;
  export const DialogTitle: React.FC<React.PropsWithChildren>;
  export const DialogDescription: React.FC<React.PropsWithChildren>;
}

declare module "@/components/Task" {
  import * as React from "react";

  interface TaskData {
    id: string | number;
    todo: string;
    completed: boolean;
    priority?: "high" | "medium" | "low";
  }

  interface TaskProps {
    task: TaskData;
    index: number;
    onToggleComplete?: (id: string | number) => void;
    onEditTask?: (task: TaskData) => void;
    onDeleteTask?: (id: string | number) => void;
  }

  const Task: React.FC<TaskProps>;
  export default Task;
}

declare module "../pages/AddToDo" {
  import { FC } from "react";
  const AddTodo: FC<{ closeModal: () => void }>;
  export default AddTodo;
}

declare module "@/utils/localsstorage" {
  import type { Todo, Category } from "@/types"; // if you already have types
  export function getLocalTodos(): Promise<Todo[]>;
  export function deleteLocalTodo(id: number | string): Promise<void>;
  export function updateLocalTodo(
    id: number | string,
    updatedFields: Partial<Todo>
  ): Promise<void>;
}

declare module "./EditToDo" {
  const EditTodoModal: React.FC<any>;
  export default EditTodoModal;
}



