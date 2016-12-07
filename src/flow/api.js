declare type AccessibleListResponse = {
  ok: boolean,
  data: {
    'private': {
      id: number,
      followers: number,
      following: number,
      customers: number,
      sells: number,
      likes: number,
      offers: number,
      name: string,
      type: string,
      user: string,
    }
  }
};