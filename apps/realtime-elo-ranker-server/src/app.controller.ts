import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  getData() {
    // Les données stockées dans le service sont accessibles et la méthode getData() peut être appelée pour les récupérer. Ces données vont systématiquement être à jour avec les ajouts effectués par les autres contextes.
    return this.appService.getData();
  }

  @Post('data')
  addData(@Body() data: string) {
    // Ajoute une donnée au tableau
    this.appService.addData(data);
    return { message: data };
  }
}
