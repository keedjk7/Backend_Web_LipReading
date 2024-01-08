import { Test, TestingModule } from '@nestjs/testing';
import { TeamPostPageService } from './team_post_page.service';

describe('TeamPostPageService', () => {
  let service: TeamPostPageService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeamPostPageService],
    }).compile();

    service = module.get<TeamPostPageService>(TeamPostPageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
