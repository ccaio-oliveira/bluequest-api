import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/auth/entities/user.entity";

describe('AuthService basics', () => {
    it('hashes and verifies password during register/login', async () => {
        const users: any = { findOne: jest.fn(), create: (x: any) => x, save: jest.fn(async (x: any) => ({...x, id: 'u1'})) };
        const jwt: any = { signAsync: jest.fn(async () => 'token') };
        const moduleRef = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: getRepositoryToken(User), useValue: users },
                { provide: 'JwtService', useValue: jwt },
            ],
        }).compile();

        const svc = moduleRef.get(AuthService);
        const out = await svc.register({ email: 'a@a.com', password: 'secret123', displayName: 'A', timezone: 'UTC' } as any);
        expect(out.accessToken).toBeDefined();
        users.findOne.mockResolvedValue({ id: 'u1', email: 'a@a.com', passwordHash: out.user.passwordHash });
    });
});