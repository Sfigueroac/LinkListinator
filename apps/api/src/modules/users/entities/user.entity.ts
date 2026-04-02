import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collection } from '../../collections/entities/collection.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  displayName: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Collection, (c) => c.owner)
  collections: Collection[];
}
