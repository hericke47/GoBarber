import 'reflect-metadata';
import AppError from '@shared/errors/AppError';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';

let fakeCacheProvider: FakeCacheProvider;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRespository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointmentService', () => {
    beforeEach(() => {
        fakeCacheProvider = new FakeCacheProvider();
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRespository = new FakeNotificationsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRespository,
            fakeCacheProvider,
        );
    });

    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13),
            provider_id: '1',
            user_id: '2',
        });

        expect(appointment).toHaveProperty('id');
    });

    it('should not be able to create two appointments on the same time', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 11, 12).getTime();
        });

        await createAppointmentService.execute({
            user_id: '123123',
            date: new Date(2020, 4, 11, 13),
            provider_id: '345345',
        });

        await expect(
            createAppointmentService.execute({
                user_id: '123123',
                date: new Date(2020, 4, 11, 13),
                provider_id: '345345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on pass date', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 11),
                provider_id: '1',
                user_id: '2',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 4, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 13),
                provider_id: '1',
                user_id: '1',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am and after 6pm', async () => {
        jest.spyOn(Date, 'now').mockImplementation(() => {
            return new Date(2020, 11, 10, 12).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 11, 11, 7),
                provider_id: '2',
                user_id: '1',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 11, 11, 19),
                provider_id: '2',
                user_id: '1',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
