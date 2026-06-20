export interface Todo {
  id: string;
  title: string;
  done: boolean;
  created: string;
}

export interface CreateTodoBody {
  title: string;
}
