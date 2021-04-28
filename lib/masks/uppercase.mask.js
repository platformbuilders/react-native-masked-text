import BaseMask from './_base.mask';

export default class UppercaseMask extends BaseMask {
  static getType() {
    return 'uppercase';
  }

  getValue(value, settings) {
    return String(value).toUpperCase();
  }

  getRawValue(maskedValue, settings) {
    return String(value).toUpperCase();
  }

  validate(value, settings) {
    return true;
  }

  getMask(value, settings) {
    return '';
  }
}
