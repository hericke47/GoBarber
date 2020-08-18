import { EntityRepository, Repository } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

import Appointment from '../entities/Appointment';
// Repository possui os metedos do typeORM de criar deletar e etc, recebendo o model como parametro

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>
    implements IAppointmentsRepository {
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        const findAppointment = await this.findOne({
            where: { date },
        });

        return findAppointment || undefined;
    }
}

export default AppointmentsRepository;
