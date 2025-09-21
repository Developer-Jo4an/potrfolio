export default function applyDecorator(Class, DecoratorClass, decoratorField) {
  return class extends Class {
    constructor(data) {
      super(data);

      if (!this.decorators)
        this.decorators = {};
      const {decorators} = this;

      decorators[decoratorField] = new DecoratorClass({controller: this, ...data});
    }
  };
};

export const applyDecorators = (Class, decorators = []) => {
  return decorators.reduce((acc, {DecoratorClass, decoratorField}) => {
    return applyDecorator(acc, DecoratorClass, decoratorField);
  }, Class);
};