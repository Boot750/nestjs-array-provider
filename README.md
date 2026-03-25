# nestjs-array-provider

A tiny utility to collect multiple NestJS providers into an injectable array. Useful for plugin, strategy, and registry patterns.

## Installation

```bash
npm install nestjs-array-provider
```

## Usage

```typescript
import { arrayProvider } from 'nestjs-array-provider';

// 1. Define a token
const PAYMENT_PROVIDERS = Symbol('PAYMENT_PROVIDERS');

// 2. Register in your module (providers are auto-registered)
@Module({
  providers: [
    ...arrayProvider<PaymentProvider>(PAYMENT_PROVIDERS, [
      DirectProvider,
      HitPayProvider,
    ]),
    PaymentService,
  ],
})
export class PaymentModule {}

// 3. Inject the array
@Injectable()
export class PaymentService {
  constructor(
    @Inject(PAYMENT_PROVIDERS)
    private readonly providers: PaymentProvider[],
  ) {}

  charge(amount: number) {
    // Use all registered providers
    return this.providers.map((p) => p.charge(amount));
  }
}
```

If your providers are already registered elsewhere (e.g. in another module), pass `false` as the third argument:

```typescript
@Module({
  imports: [ProvidersModule],
  providers: [
    arrayProvider<PaymentProvider>(PAYMENT_PROVIDERS, [DirectProvider, HitPayProvider], false),
    PaymentService,
  ],
})
export class PaymentModule {}
```

## API

### `arrayProvider<T>(token, providers, registerProviders?)`

| Parameter            | Type             | Default | Description                                          |
| -------------------- | ---------------- | ------- | ---------------------------------------------------- |
| `token`              | `InjectionToken` |         | The injection token to provide the array under        |
| `providers`          | `Type<T>[]`      |         | Array of classes to collect into the injected array   |
| `registerProviders`  | `boolean`        | `true`  | Whether to also register the individual providers     |

Returns `Provider[]` when `registerProviders` is `true` (default) — spread into your providers array.
Returns a single `Provider` when `registerProviders` is `false`.

## Why?

NestJS doesn't have a built-in way to inject all implementations of an interface as an array. The common workaround involves verbose boilerplate with `useFactory` and manual `inject` lists. `arrayProvider` wraps that pattern into a single, type-safe call.

## License

MIT
