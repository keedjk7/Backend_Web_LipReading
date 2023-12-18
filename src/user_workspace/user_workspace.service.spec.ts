import { Test, TestingModule } from '@nestjs/testing';
import { UserWorkspaceService } from './user_workspace.service';

describe('UserWorkspaceService', () => {
  let service: UserWorkspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWorkspaceService],
    }).compile();

    service = module.get<UserWorkspaceService>(UserWorkspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
