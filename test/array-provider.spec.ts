import { Test } from '@nestjs/testing';
import { Injectable } from '@nestjs/common';
import { arrayProvider } from '../src';

const SERVICES = Symbol('SERVICES');

interface Greeter {
  greet(): string;
}

@Injectable()
class HelloService implements Greeter {
  greet() {
    return 'hello';
  }
}

@Injectable()
class WorldService implements Greeter {
  greet() {
    return 'world';
  }
}

describe('arrayProvider', () => {
  it('should inject all registered providers as an array', async () => {
    const module = await Test.createTestingModule({
      providers: [
        HelloService,
        WorldService,
        arrayProvider<Greeter>(SERVICES, [HelloService, WorldService]),
      ],
    }).compile();

    const services = module.get<Greeter[]>(SERVICES);

    expect(services).toHaveLength(2);
    expect(services[0].greet()).toBe('hello');
    expect(services[1].greet()).toBe('world');
  });

  it('should work with a single provider', async () => {
    const module = await Test.createTestingModule({
      providers: [
        HelloService,
        arrayProvider<Greeter>(SERVICES, [HelloService]),
      ],
    }).compile();

    const services = module.get<Greeter[]>(SERVICES);

    expect(services).toHaveLength(1);
    expect(services[0].greet()).toBe('hello');
  });

  it('should work with an empty array', async () => {
    const module = await Test.createTestingModule({
      providers: [arrayProvider<Greeter>(SERVICES, [])],
    }).compile();

    const services = module.get<Greeter[]>(SERVICES);

    expect(services).toHaveLength(0);
    expect(services).toEqual([]);
  });

  it('should work with a string token', async () => {
    const module = await Test.createTestingModule({
      providers: [
        HelloService,
        arrayProvider<Greeter>('MY_SERVICES', [HelloService]),
      ],
    }).compile();

    const services = module.get<Greeter[]>('MY_SERVICES');

    expect(services).toHaveLength(1);
  });
});
