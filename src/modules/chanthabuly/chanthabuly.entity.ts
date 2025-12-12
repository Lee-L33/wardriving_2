import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity()
export class Chanthabuly_network {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", length: 255, nullable: true })
    ssid!: string;

    @Index({ unique: true })
    @Column({ type: "varchar", length: 255 })
    bssid!: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    manufacturer!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    authentication!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    encryption!: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    radio_type!: string;

    @Column({ type: "int", nullable: true })
    channel!: number;

    @Column({ type: "int", nullable: true })
    frequency!: number;

    @Column({ type: "int", nullable: true })
    signal_strength!: number;

    @Index()
    @Column({ type: "decimal", precision: 10, scale: 8 })
    latitude!: number;

    @Index()
    @Column({ type: "decimal", precision: 11, scale: 8 })
    longitude!: number;

    @Column({ type: "datetime", nullable: true })
    first_seen!: Date;

    @Column({ type: "datetime", nullable: true })
    last_seen!: Date;

    @Column({ type: "varchar", length: 50, nullable: true })
    network_type!: string;

    @CreateDateColumn()
    created_at!: Date;

    @UpdateDateColumn()
    updated_at!: Date;
}
