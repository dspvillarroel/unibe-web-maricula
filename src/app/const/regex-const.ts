import {TypesRegexEnum} from '../enum/types-regex-enum';

export const SeverityPatterns: { [key in TypesRegexEnum]: RegExp } = {
  [TypesRegexEnum.ALPHANUMERIC]: /^[a-z0-9A-ZÁÉÍÓÚÑáéíóúñ\s]+$/i,
};
