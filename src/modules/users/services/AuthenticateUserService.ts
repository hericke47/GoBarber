import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import authConfig from '@config/auth';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

import User from '../infra/typeorm/entities/User';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

class AuthenticateUserService {
    constructor(private usersRepository: IUsersRepository) {}

    public async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);
        // procura se o email do usuario é igual a algum já cadastrado
        // esse if verifica se o valor foi encontrado ou retornou null, se retornou null ele retorna um erro
        if (!user) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        // user.password = senha criptografada
        // password = senha não criptografada

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched) {
            throw new AppError('Incorrect email/password combination.', 401);
        }

        // sign n precisa de await pois ele n retorna uma promise

        const { secret, expiresIn } = authConfig.jwt;
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return {
            user,
            token,
        };
    }
}

export default AuthenticateUserService;
