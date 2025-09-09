import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn  } from "typeorm";

@Entity()
export class district {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    province_id!: number;

    @Column({ type: "varchar", length: 120, unique: true })
    name!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
};