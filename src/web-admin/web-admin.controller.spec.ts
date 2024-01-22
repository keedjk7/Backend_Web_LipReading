import { Test, TestingModule } from '@nestjs/testing';
import { WebAdminController } from './web-admin.controller';
import { WebAdminService } from './web-admin.service';

describe('WebAdminController', () => {
  let controller: WebAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebAdminController],
      providers: [WebAdminService],
    }).compile();

    controller = module.get<WebAdminController>(WebAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
