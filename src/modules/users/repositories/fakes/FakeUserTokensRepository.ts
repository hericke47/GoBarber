import { uuid } from 'uuidv4';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';
// Repository possui os metedos do typeORM de criar deletar e etc, recebendo o model como parametro

class FakeUserTokensRepository implements IUserTokensRepository {
    private userTokens: UserToken[] = [];

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = new UserToken();

        Object.assign(userToken, {
            id: uuid(),
            token: uuid(),
            user_id: uuid(),
        });

        this.userTokens.push(userToken);

        return userToken;
    }
}

export default FakeUserTokensRepository;
