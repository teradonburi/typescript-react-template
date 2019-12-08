import {Document} from 'mongoose'

export namespace model {
  export interface User extends Document {
    gender: string;
    first: string;
    last: string;
    email: string;
    thumbnail: string;
  }
}

export namespace route {
  export interface User {
    gender?: string;
    name?: {
      first?: string;
      last?: string;
    };
    email?: string;
    picture?: {
      thumbnail?: string;
    };
  }
}
