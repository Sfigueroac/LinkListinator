import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('links')
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  favicon: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Collection, (c) => c.links, { onDelete: 'CASCADE' })
  collection: Collection;

  @Column()
  collectionId: string;

  @ManyToMany(() => Tag, (t) => t.links, { cascade: true, eager: true })
  @JoinTable({ name: 'link_tags' })
  tags: Tag[];
}
