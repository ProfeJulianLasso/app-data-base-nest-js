import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let dataSource: DataSource;
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
        // save: jest.fn(),
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
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DataSource,
          useFactory: dataSourceMockFactory,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    dataSource = app.get<DataSource>(DataSource);
  });

  describe('appController', () => {
    it('Instancias', () => {
      expect(appController).toBeDefined();
      expect(dataSource).toBeDefined();
    });

    it('Objeto de Usuario', async () => {
      // Arrange
      const expected = {
        clienteNombre: 'Julian Lasso',
        clienteCorreo: 'julian.lasso@sofka.com.co',
        id: 1,
      };
      // const dataMock = expected;
      const data = {
        clienteNombre: 'Julian Lasso',
        clienteCorreo: 'julian.lasso@sofka.com.co',
      };
      // jest
      //   .spyOn(dataSource.createQueryRunner().manager, 'save')
      //   .mockResolvedValue(dataMock);

      // Act
      const result = await appController.createFactura(data);

      // Assert
      expect(result).toEqual(expected);
      // listo, vamos para crear una liberación alpha
    });
  });
});
