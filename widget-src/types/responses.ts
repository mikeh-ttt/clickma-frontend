export type GetTeamsType = {
  teams: Team[];
};

export type GetTaskByIDType = {
  html_description?: string;
  markdown_description?: string;
  id: ID;
  custom_id: string;
  custom_item_id: number;
  name: string;
  text_content: string;
  description: string;
  status: Status;
  orderindex: string;
  date_created: UnixTimestamp;
  date_updated: UnixTimestamp;
  date_closed: UnixTimestamp | null;
  date_done: UnixTimestamp | null;
  archived: boolean;
  creator: ClickUpUser;
  assignees: ClickUpUser[];
  watchers: ClickUpUser[];
  checklists: any[]; // You might want to create a more specific type for checklists
  tags: Tag[];
  parent: any | null; // You might want to create a more specific type for parent tasks
  priority?: Priority;
  due_date: UnixTimestamp | null;
  start_date: UnixTimestamp | null;
  points: number | null;
  time_estimate: number | null;
  time_spent: number;
  custom_fields: CustomField[];
  dependencies: any[]; // You might want to create a more specific type for dependencies
  linked_tasks: any[]; // You might want to create a more specific type for linked tasks
  team_id: string;
  url: URL;
  sharing: Sharing;
  permission_level: string;
  list: List;
  project: Project;
  folder: Project; // Reusing Project type as they have the same structure
  space: Space;
  attachments: Attachment[];
};
