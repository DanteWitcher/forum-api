import {
  registerDecorator,
  ValidationArguments,
  buildMessage,
} from 'class-validator';

export function IsPassword(rule: RegExp) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [rule],
      validator: {
        validate(value: string, args: ValidationArguments) {
          const regex = args.constraints[0];

          return regex.test(value);
        },
        defaultMessage: buildMessage(
          () =>
            `Password should be: Minimum eight in length; at least one upper, one lower case, one digit, one special character`,
        ),
      },
    });
  };
}
