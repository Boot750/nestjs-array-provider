import { InjectionToken, Provider, Type } from '@nestjs/common';

/**
 * Creates a NestJS provider that injects multiple services and provides them as an array.
 *
 * This is useful for implementing plugin/strategy patterns where you want to collect
 * all implementations of an interface and inject them as an array.
 *
 * @example
 * // Define a token:
 * const PAYMENT_PROVIDERS = Symbol('PAYMENT_PROVIDERS');
 *
 * // In your module:
 * @Module({
 *   providers: [
 *     DirectProvider,
 *     HitPayProvider,
 *     arrayProvider<PaymentProvider>(PAYMENT_PROVIDERS, [DirectProvider, HitPayProvider]),
 *     PaymentProviderRegistry,
 *   ],
 * })
 *
 * // In your service:
 * constructor(
 *   @Inject(PAYMENT_PROVIDERS)
 *   private readonly providers: PaymentProvider[],
 * ) {}
 */
export function arrayProvider<T>(
  token: InjectionToken,
  providers: Type<T>[],
): Provider {
  return {
    provide: token,
    useFactory: (...instances: T[]) => instances,
    inject: providers,
  };
}
