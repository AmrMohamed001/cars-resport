import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/reports.entity';
import {
  BeforeInsert,
  BeforeRemove,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  // @Exclude()
  password: string;

  @Column({ default: true }) //fix
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @BeforeInsert()
  logInsert() {
    console.log('insert operation');
  }
  @BeforeUpdate()
  logUpdate() {
    console.log('update operation');
  }

  @BeforeRemove()
  logDelete() {
    console.log('delete operation');
  }
}
