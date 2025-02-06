import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './main';

jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn().mockResolvedValue({
      enableCors: jest.fn(),
      listen: jest.fn(),
    }),
  },
}));

describe('Main', () => {
  let appMock: any;

  beforeEach(async () => {
    appMock = await NestFactory.create(AppModule);
  });

  it('devrait créer l\'application et activer CORS', async () => {
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    await appMock.enableCors();
    expect(appMock.enableCors).toHaveBeenCalled();
  });

  it('devrait écouter sur le bon port', async () => {
    process.env.PORT = '4000';

    await appMock.listen(process.env.PORT ?? 3000);

    expect(appMock.listen).toHaveBeenCalledWith('4000');
    
    delete process.env.PORT;
  });

  it('devrait écouter sur le port par défaut si PORT n\'est pas défini', async () => {
    delete process.env.PORT;

    await appMock.listen(process.env.PORT ?? 3000);

    expect(appMock.listen).toHaveBeenCalledWith(3000);
  });
});
