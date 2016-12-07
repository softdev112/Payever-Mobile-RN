declare type UserAccount = {
  avatar: string,
  birthday: ?string,
  confirmation_token: ?string,
  created_at: string,
  default_language: ?string
  email: string,
  enabled: boolean,
  first_name: string,
  full_name: string,
  last_name: string,
  marketing_source: ?string,
  profile_id: string,
  registration_completed: boolean,
  registration_source: string,
  roles: Array<string>,
  updated_at: string,
}