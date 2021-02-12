import BaseMask from './_base.mask';
import CustomMask from './custom.mask';

const PHONE_8_MASK = '9999-9999';
const PHONE_9_MASK = '99999-9999';
const PHONE_INTERNATIONAL = '+999 999 999 999';

const MASK_TYPES = {
  BRL: 'BRL',
  INTERNATIONAL: 'INTERNATIONAL',
};

const CEL_PHONE_SETTINGS = {
  maskType: MASK_TYPES.BRL,
  withDDD: true,
  dddMask: '(99) ',
};

export default class CelPhoneMask extends BaseMask {
  static getType() {
    return 'cel-phone';
  }

  getValue(value, settings) {
    const cleanedValue = super.removeNotNumbers(value);
    const mask = this.getMask(cleanedValue, settings);
    return CustomMask.shared.getValue(cleanedValue, { mask });
  }

  getRawValue(maskedValue, settings) {
    return super.removeNotNumbers(maskedValue);
  }

  validate(value, settings) {
    let valueToValidate = super.getDefaultValue(value);
    valueToValidate = this.getValue(value, settings);

    const mask = this.getMask(value, settings);

    return valueToValidate.length === mask.length;
  }

  getMask(value, settings) {
    const mergedSettings = super.mergeSettings(CEL_PHONE_SETTINGS, settings);

    if (mergedSettings.maskType === MASK_TYPES.INTERNATIONAL) {
      return PHONE_INTERNATIONAL;
    }

    const numbers = super.removeNotNumbers(value);
    let mask = PHONE_8_MASK;

    const use9DigitMask = (() => {
      if (mergedSettings.withDDD) {
        const numbersDDD = super.removeNotNumbers(mergedSettings.dddMask);
        const remainingValueNumbers = numbers.substr(numbersDDD.length);
        return remainingValueNumbers.length >= 9;
      }
      return numbers.length >= 9;
    })();

    if (use9DigitMask) {
      mask = PHONE_9_MASK;
    }

    if (mergedSettings.withDDD) {
      mask = `${mergedSettings.dddMask}${mask}`;
    }

    return mask;
  }
}
