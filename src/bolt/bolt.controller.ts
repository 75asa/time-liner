import { Controller } from '@nestjs/common';
import { BoltService } from './bolt.service';

@Controller('bolt')
export class BoltController {
  constructor(private boltService: BoltService) {}
}
