import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { District } from "../districts/district.entity";

@Entity()
export class Vientaine_pre_network {
    @PrimaryGeneratedColumn()
    network_id!: number;

    @Column()
    district_id!: number;

    @ManyToOne(() => District, (district) => district.vientaine_pre_networks)
    @JoinColumn({ name: "district_id" })
    districtData!: District;

    @Column()
    user_id!: number;

    @Column({ type: "varchar", length: 255 })
    ssid!: string;

    @Index({ unique: true })
    @Column({ type: "varchar", length: 255 })
    bssid!: string;

    @Column()
    manufacturer!: string;

    @Column()
    signal_strength!: number;

    @Column()
    authentication!: string;

    @Column()
    encryption!: string;

    @Column()
    radio_type!: string;

    @Column()
    channel!: number;

    @Column()
    latitude!: number;

    @Column()
    longitude!: number;

    @Column()
    scan_timestamp!: Date;

    @Column()
    network_identifier!: string;

    @Column()
    frequency!: number;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
};