import { Test, TestingModule } from '@nestjs/testing';
import { BoltService } from './bolt.service';

describe('BoltService', () => {
  let service: BoltService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BoltService],
    }).compile();

    service = module.get<BoltService>(BoltService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
