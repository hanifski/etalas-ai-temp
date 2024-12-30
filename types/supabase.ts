export type Profile = {
  id: string;
  user_id: string;
  name: string | null;
  active_workspace: string | null;
  avatar_url: string | null;
};

export type File = {
  file_url: string;
  file_name: string;
  file_type: string;
};

export type Assistant = {
  id?: string;
  name: string;
  model: string;
  description: string;
  temperature: number;
  files: File[];
  file_ids: string[];
  vector_store_id: string;
  user_id: string;
  workspace_id: string;
};
