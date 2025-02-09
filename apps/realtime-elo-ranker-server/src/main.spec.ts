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

  it('should create the application and activate CORS', async () => {
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    await appMock.enableCors();
    expect(appMock.enableCors).toHaveBeenCalled();
  });

  it('should listen on the right port', async () => {
    process.env.PORT = '4000';

    await appMock.listen(process.env.PORT ?? 3000);

    expect(appMock.listen).toHaveBeenCalledWith('4000');
    
    delete process.env.PORT;
  });

  it('should listen on the default port if PORT is not defined', async () => {
    delete process.env.PORT;

    await appMock.listen(process.env.PORT ?? 3000);

    expect(appMock.listen).toHaveBeenCalledWith(3000);
  });
});
