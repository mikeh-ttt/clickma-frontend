type Team = {
  id: string;
  name: string;
  color: string;
  avatar: string | null;
  members: Member[];
};

type Member = {
  user: ClickUpUser;
  invited_by: InvitedBy;
  can_see_time_spent?: boolean;
  can_see_time_estimated?: boolean;
  can_see_points_estimated?: boolean;
  can_edit_tags?: boolean;
  can_create_views?: boolean;
};

type ClickUpUser = {
  id: number;
  username: string | null;
  email: string;
  color: string | null;
  profilePicture: string | null;
  initials: string;
  role: number;
  role_subtype: number;
  custom_role: string | null;
  last_active: string | null;
  date_joined: string | null;
  date_invited: string;
};

type InvitedBy = {
  id: number;
  username: string;
  color: string;
  email: string;
  initials: string;
  profilePicture: string | null;
  banned_date: string | null;
  status: 'active' | 'invited';
};

type ID = string;
type UnixTimestamp = number;
type URL = string;

interface Status {
  id: string;
  status: string;
  color: string;
  orderindex: number;
  type: string;
}

interface Priority {
  color: string;
  id: string;
  orderindex: string;
  priority: string;
}

interface Tag {
  name: string;
  tag_fg: string;
  tag_bg: string;
  creator: number;
}

interface Attachment {
  id: string;
  date: UnixTimestamp;
  title: string;
  type: number;
  source: number;
  version: number;
  extension: string;
  thumbnail_small: URL;
  thumbnail_medium: URL;
  thumbnail_large: URL;
  is_folder: boolean | null;
  mimetype: string;
  hidden: boolean;
  parent_id: ID;
  size: number;
  total_comments: number;
  resolved_comments: number;
  user: User;
  deleted: boolean;
  orientation: string | null;
  url: URL;
  email_data: any | null;
  workspace_id: ID | null;
  url_w_query: URL;
  url_w_host: URL;
}

interface CustomField {
  id: ID;
  name: string;
  type: string;
  type_config: {
    [key: string]: any;
  };
  date_created: UnixTimestamp;
  hide_from_guests: boolean;
  value?: any;
  required: boolean;
}

interface List {
  id: ID;
  name: string;
  access: boolean;
}

interface Project {
  id: ID;
  name: string;
  hidden: boolean;
  access: boolean;
}

interface Space {
  id: ID;
}

interface Sharing {
  public: boolean;
  public_share_expires_on: string | null;
  public_fields: string[];
  token: string | null;
  seo_optimized: boolean;
}
