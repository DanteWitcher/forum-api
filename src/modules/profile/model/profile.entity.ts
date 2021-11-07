import { ERole } from 'src/share/enums/role.enum';
import { PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Entity } from 'typeorm';

@Entity()
export abstract class ProfileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar',  length: 300 })
    email: string;

    @Column({ type: 'enum', enum: ERole, default: ERole.USER })
    role: ERole;

	@Column({ type: 'varchar', length: 300 })
    nickName: string;

    @Column({ type: 'varchar', length: 300, default: '' })
    firstName: string;

	@Column({ type: 'varchar', length: 300, default: '' })
    middleName: string;

	@Column({ type: 'varchar', length: 300, default: '' })
    lastName: string;

	@Column({ type: 'varchar', length: 300, default: '' })
    phone: string;

	@Column({ type: 'varchar', length: 300, default: '' })
    photoUrl: string;

	@CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    createDateTime: Date;

    @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    lastChangedDateTime: Date;
}