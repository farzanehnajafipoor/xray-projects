import { Test, TestingModule } from '@nestjs/testing';
import { SignalsService } from './signals.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Signal } from './schemas/signal.schema';

const mockSignal = {
  deviceId: 'abc123',
  time: Date.now(),
  dataLength: 3,
  dataVolume: 123,
};

describe('SignalsService', () => {
  let service: SignalsService;
  let model: Model<Signal>;

  const mockModel = {
    create: jest.fn().mockResolvedValue(mockSignal),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockSignal]),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignalsService,
        { provide: getModelToken('Signal'), useValue: mockModel },
      ],
    }).compile();

    service = module.get<SignalsService>(SignalsService);
    model = module.get<Model<Signal>>(getModelToken('Signal'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find signals', async () => {
    const result = await service.findAll({});
    expect(result).toEqual([mockSignal]);
  });
});
