import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { DataSource } from 'typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  type MockType<T> = {
    [P in keyof T]?: jest.Mock;
  };
  const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({
    createQueryRunner: jest.fn().mockImplementation(() => ({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      release: jest.fn(),
      rollbackTransaction: jest.fn(),
      manager: {
        save: jest.fn().mockResolvedValue({
          clienteNombre: 'Julian Lasso',
          clienteCorreo: 'julian.lasso@sofka.com.co',
          id: 1,
        }),
      },
      commitTransaction: jest.fn(),
    })),
  }));

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/ (POST)', () => {
    return request(app.getHttpServer())
      .post('/')
      .send({
        clienteNombre: 'Julian Lasso',
        clienteCorreo: 'julian.lasso@sofka.com.co',
      })
      .expect(201)
      .expect({
        clienteNombre: 'Julian Lasso',
        clienteCorreo: 'julian.lasso@sofka.com.co',
        id: 1,
      });
  });
});
