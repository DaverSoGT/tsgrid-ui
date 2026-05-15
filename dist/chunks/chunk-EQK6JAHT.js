// src/lazy-singleton.ts
function lazySingleton(factory, protoRef) {
  let _impl = null;
  const materialize = () => _impl ??= factory();
  return new Proxy({}, {
    get(_t, prop, receiver) {
      return Reflect.get(materialize(), prop, receiver);
    },
    set(_t, prop, value, _receiver) {
      return Reflect.set(materialize(), prop, value, materialize());
    },
    has(_t, prop) {
      return Reflect.has(materialize(), prop);
    },
    ownKeys() {
      return Reflect.ownKeys(materialize());
    },
    getOwnPropertyDescriptor(_t, prop) {
      return Reflect.getOwnPropertyDescriptor(materialize(), prop);
    },
    defineProperty(_t, prop, desc) {
      return Reflect.defineProperty(materialize(), prop, desc);
    },
    getPrototypeOf() {
      return protoRef.prototype;
    }
  });
}

export {
  lazySingleton
};
//# sourceMappingURL=chunk-EQK6JAHT.js.map