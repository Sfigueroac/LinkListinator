import { Link } from './link.model';
import { User } from './user.model';

export interface Collection {
  id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  ownerId: string;
  owner?: User;
  links?: Link[];
  createdAt: string;
  updatedAt: string;
}
