import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn  } from "typeorm";
import { District } from "../districts/district.entity";

@Entity()
export class Village {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    districtId!: number;

    @ManyToOne(() => District, (district) => district.villages)
    @JoinColumn({ name: "districtId" })
    districtData!: District;

    @Column({ type: "varchar", length: 120, unique: true })
    villageName!: string;

    @Column({ type: "varchar", length: 120, unique: true })
    villageCode!: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
};