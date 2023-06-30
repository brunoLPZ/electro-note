export interface Note {
  uuid: string;
  title: string;
  description?: string;
  content: string;
  lastModifiedDate?: number;
  tags: string[];
  tasks?: Task[];
}
