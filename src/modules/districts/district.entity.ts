import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany  } from "typeorm";
import { Province } from "../provinces/province.entity";
import { Village } from "../villages/village.entity";
import { Attapue_network } from "../attapue/attapue.entity";
import { Vientaine_pre_network } from "../vientaine_pre/vientaine_pre.entity";

@Entity()
export class District {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    provinceId!: number;

    @ManyToOne(() => Province, (province) => province.districts)
    @JoinColumn({ name: "provinceId" })
    provinceData!: Province;

    @Column({ type: "int", unsigned: true })
    districtCode!: number;

    @Column({ type: "varchar", length: 120, unique: true })
    districtName!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;

    @OneToMany(() => Village, (village) => village.districtData)
    villages!: Village[];

    @OneToMany(() => Attapue_network, (attapue_network) => attapue_network.districtData)
    attapue_networks!: Attapue_network[];

    @OneToMany(() => Vientaine_pre_network, (vientaine_pre_network) => vientaine_pre_network.districtData)
    vientaine_pre_networks!: Attapue_network[];
};