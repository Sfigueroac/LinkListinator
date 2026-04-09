import { Tag } from './tag.model';

export interface Link {
  id: string;
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  collectionId: string;
  collection?: { id: string; name: string };
  tags: Tag[];
  createdAt: string;
}
