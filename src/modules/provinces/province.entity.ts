import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany  } from "typeorm";
import { District } from "../districts/district.entity";

@Entity()
export class Province {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 120, unique: true })
    provinceName!: string;

    @Column({ type: "varchar", length: 120, unique: true })
    provinceCode!: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => District, (district) => district.provinceData)
    districts!: District[];
};