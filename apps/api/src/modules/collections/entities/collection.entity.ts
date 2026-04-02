import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Link } from '../../links/entities/link.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isPublic: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (u) => u.collections, { onDelete: 'CASCADE' })
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => Link, (l) => l.collection)
  links: Link[];
}
