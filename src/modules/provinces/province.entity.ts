import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany  } from "typeorm";
import { District } from "../districts/district.entity";

@Entity()
export class Province {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "int", unsigned: true })
    provinceCode!: number;

    @Column({ type: "varchar", length: 120, unique: true })
    provinceName!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => District, (district) => district.provinceData)
    districts!: District[];
};