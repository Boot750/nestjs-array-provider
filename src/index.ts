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
 * // Auto-registers providers (use spread):
 * @Module({
 *   providers: [
 *     ...arrayProvider<PaymentProvider>(PAYMENT_PROVIDERS, [DirectProvider, HitPayProvider]),
 *   ],
 * })
 *
 * // Providers already registered elsewhere (no spread needed):
 * @Module({
 *   providers: [
 *     arrayProvider<PaymentProvider>(PAYMENT_PROVIDERS, [DirectProvider, HitPayProvider], false),
 *   ],
 * })
 *
 * // In your service:
 * constructor(
 *   @Inject(PAYMENT_PROVIDERS)
 *   private readonly providers: PaymentProvider[],
 * ) {}
 */
export function arrayProvider<T>(token: InjectionToken, providers: Type<T>[], registerProviders: true): Provider[];
export function arrayProvider<T>(token: InjectionToken, providers: Type<T>[], registerProviders: false): Provider;
export function arrayProvider<T>(token: InjectionToken, providers: Type<T>[]): Provider[];
export function arrayProvider<T>(
  token: InjectionToken,
  providers: Type<T>[],
  registerProviders: boolean = true,
): Provider | Provider[] {
  const factory: Provider = {
    provide: token,
    useFactory: (...instances: T[]) => instances,
    inject: providers,
  };

  return registerProviders ? [...providers, factory] : factory;
}
