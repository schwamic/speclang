export interface Todo {
  id: string;
  title: string;
  done: boolean;
  created: string;
}

export type Filter = 'Alle' | 'Offen' | 'Erledigt';
