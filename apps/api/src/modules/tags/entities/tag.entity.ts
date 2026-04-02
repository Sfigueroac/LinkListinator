import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Link } from '../../links/entities/link.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Link, (l) => l.tags)
  links: Link[];
}
