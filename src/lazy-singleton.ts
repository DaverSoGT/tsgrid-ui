/**
 * Creates a lazily-initialized singleton wrapped in a transparent Proxy.
 * The factory is invoked at most once, on first property access / set / has /
 * instanceof / ownKeys / getOwnPropertyDescriptor.
 *
 * `protoRef` is the class whose `.prototype` is returned by `getPrototypeOf`.
 * It is required so `instanceof` works without triggering materialization.
 */
export function lazySingleton<T extends object>(
    factory: () => T,
    protoRef: { prototype: object },
): T {
    let _impl: T | null = null
    const materialize = (): T => (_impl ??= factory())
    // `as T` cast is purely for type erasure — runtime sees an empty object as target.
    return new Proxy({} as T, {
        get(_t, prop, receiver) { return Reflect.get(materialize(), prop, receiver) },
        set(_t, prop, value, _receiver) { return Reflect.set(materialize(), prop, value, materialize()) },
        has(_t, prop) { return Reflect.has(materialize(), prop) },
        ownKeys() { return Reflect.ownKeys(materialize()) },
        getOwnPropertyDescriptor(_t, prop) { return Reflect.getOwnPropertyDescriptor(materialize(), prop) },
        defineProperty(_t, prop, desc) { return Reflect.defineProperty(materialize(), prop, desc) },
        getPrototypeOf() { return protoRef.prototype },
    })
}
