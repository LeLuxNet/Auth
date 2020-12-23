import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role";

export interface RTData {
  sub: string;
}

export interface ATData {
  sub: string;
  username: string;
  email: string;
  emailVerified: boolean;
  roles: Role[];
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "citext", unique: true })
  username!: string;

  @Column({ type: "citext", unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: false })
  emailVerified!: boolean;

  @Column({
    type: "enum",
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  roles!: Role[];

  getRTData(): RTData {
    return {
      sub: this.id,
    };
  }

  getATData(): ATData {
    return {
      sub: this.id,
      username: this.username,
      email: this.email,
      emailVerified: this.emailVerified,
      roles: this.roles,
    };
  }
}
