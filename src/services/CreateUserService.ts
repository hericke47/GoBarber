import { getRepository } from 'typeorm';
import User from '../models/User';

interface Request {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute({ name, email, password }: Request): Promise<User> {
        const usersRepository = getRepository(User);

        // Regra para não criar usuario duplicado

        const checkUserExists = await usersRepository.findOne({
            where: { email },
        });

        if (checkUserExists) {
            throw new Error('Email address already used.');
        }

        // Criando inicialmente sem a criptografia

        const user = usersRepository.create({
            // create cria a instancia mas n salva no banco
            name,
            email,
            password,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;
