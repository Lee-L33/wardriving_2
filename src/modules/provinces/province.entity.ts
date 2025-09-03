import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn  } from "typeorm";

@Entity()
export class province {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 120, unique: true })
    name!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
};