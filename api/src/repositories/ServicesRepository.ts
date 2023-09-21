import { endOfDay, startOfDay } from 'date-fns';
import { prisma } from '../database/prisma';
import { ICreate } from '../interfaces/SchedulesInterface';

class SchedulesRepository {
    // Criação de um novo agendamento.
    async create({ name, phone, date, user_id }: ICreate) {
        console.log(user_id);
        const result = await prisma.schedule.create({
            data: {
                name,
                phone,
                date,
                user_id,
            },
        });
        return result;
    }
    // Busca um agendamento com base na data e no ID do usuário.
    async find(date: Date, user_id: string) {

        const result = await prisma.schedule.findFirst({
            where: { date, user_id },
        });

        return result;
    }
    // Busca um agendamento pelo seu ID único.
    async findById(id: string) {
        const result = await prisma.schedule.findUnique({
            where: { id },
        });
        return result;
    }
    // Busca todos os agendamentos para um determinado dia.
    async findAll(date: Date) {
        const result = await prisma.schedule.findMany({
            where: {
                date: {
                    gte: date, // No need to use startOfDay here
                    lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Adding 24 hours to cover the whole day
                },
            },
            orderBy: {
                date: 'asc',
            },
        });
        return result;
    }

    // async findAll(date: Date) {
    //     const result = await prisma.schedule.findMany({
    //         where: {
    //             date: {
    //                 gte: startOfDay(date),
    //                 lt: endOfDay(date),
    //             },
    //         },
    //         orderBy: {
    //             date: 'asc',
    //         },
    //     });
    //     return result;
    // }

    // Atualiza a data de um agendamento específico.
    async update(id: string, date: Date) {
        const result = await prisma.schedule.update({
            where: {
                id,
            },
            data: {
                date: date
            },
        });
        return result;
    }
    // Exclui um agendamento com base no seu ID.
    async delete(id: string) {
        const result = await prisma.schedule.delete({
            where: {
                id,
            },
        });
        return result;
    }
}
export { SchedulesRepository };