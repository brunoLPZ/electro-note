export interface Note {
  uuid: string;
  title: string;
  isTemplate: boolean;
  description?: string;
  content: string;
  lastModifiedDate?: number;
  tags: string[];
  tasks?: Task[];
}
