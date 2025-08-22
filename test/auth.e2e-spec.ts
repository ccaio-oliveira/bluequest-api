import { INestApplication, ValidationPipe } from "@nestjs/common"
import { Test } from "@nestjs/testing";
import { AppModule } from "src/app.module";
import * as request from 'supertest';

describe('Auth E2E', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('register + login', async () => {
        const reg = await request(app.getHttpServer())
        .post('/auth/register').send({ email: 'test@x.com', password: 'secret123', displayName: 'Test', timezone: 'UTC' })
        .expect(201);

        const login = await request(app.getHttpServer())
        .post('/auth/login').send({ email: 'test@x.com', password: 'secret123' })
        .expect(200);

        expect(login.body.accessToken).toBeDefined();
    });
});