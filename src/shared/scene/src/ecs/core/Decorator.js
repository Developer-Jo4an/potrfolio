import {Unit} from "./Unit";

export class Decorator extends Unit {
  /**
   * Добавляет динамически в систему методы декоратора
   * @warning не добавляет стрелочные методы, геттеры, сеттеры, поля декоратора, только function declaration методы
   * @param system
   */
  rollDescriptors(system) {
    const allDescriptors = Object.getOwnPropertyDescriptors(this.constructor.prototype);

    const filteredDescriptors = {};
    for (const key in allDescriptors) {
      const descriptor = allDescriptors[key];
      if (!descriptor.set && !descriptor.get) {
        filteredDescriptors[key] = descriptor;
      }
    }

    for (const key in filteredDescriptors) {
      if (key === "constructor") continue;
      const descriptor = filteredDescriptors[key];
      this.addDescriptor(key, descriptor, system);
    }
  }

  addDescriptor(key, descriptor, system) {
    if (key in system) {
      this.warnLog(key, system);

      const savedMethod = system[key].bind(system);
      const prevDescriptorValue = descriptor.value.bind(this);

      descriptor.value = function () {
        savedMethod(...arguments);
        prevDescriptorValue(...arguments);
      };
    }

    Object.defineProperty(system, key, descriptor);
  }

  warnLog(key, system) {
    console.group();
    console.warn("Конфликт имен дескриптора системы и декоратора");
    console.warn("System:", system);
    console.warn("Decorator:", this);
    console.warn("Descriptor name:", key);
    console.warn("Descriptor system:", system[key]);
    console.warn("Descriptor decorator:", this[key]);
    console.groupEnd();
  }
}

