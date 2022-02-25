import { Test, TestingModule } from '@nestjs/testing';
import { BoltController } from './bolt.controller';

describe('BoltController', () => {
  let controller: BoltController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoltController],
    }).compile();

    controller = module.get<BoltController>(BoltController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
