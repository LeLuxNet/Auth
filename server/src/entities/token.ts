import { BaseEntity, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user";

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  token!: string;

  @ManyToOne(() => User)
  user!: User;
}
