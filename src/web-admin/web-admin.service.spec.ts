import { Test, TestingModule } from '@nestjs/testing';
import { WebAdminService } from './web-admin.service';

describe('WebAdminService', () => {
  let service: WebAdminService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebAdminService],
    }).compile();

    service = module.get<WebAdminService>(WebAdminService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
