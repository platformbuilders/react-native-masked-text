/* eslint-disable require-jsdoc */
/* eslint-disable no-unused-vars */
import BaseMask from './_base.mask';
import CustomMask from './custom.mask';

const MASK_BANK_SLIP_COMMON =
  '99999.99999\n99999.999999\n99999\n999999\n9\n99999999999999';
const MASK_BANK_SLIP_ANOTHER =
  '99999999999\n9\n99999999999\n9\n99999999999\n9\n99999999999\n9';

const checkBill = (string) => string.charAt(0) !== '8';

const customMaskOptions = (value) => {
  if (value && checkBill(value)) {
    return { mask: MASK_BANK_SLIP_COMMON };
  }
  return { mask: MASK_BANK_SLIP_ANOTHER };
};

const validateLength = (value, toOnlyNumbers) =>
  (value && checkBill(value)
    ? toOnlyNumbers(value).length === 47
    : toOnlyNumbers(value).length === 48) || false;

export default class OnlyNumbersMask extends BaseMask {
  static getType() {
    return 'bank-slip';
  }

  getValue(value, settings) {
    return CustomMask.shared.getValue(value, customMaskOptions(value));
  }

  getRawValue(maskedValue, settings) {
    return super.removeNotNumbers(maskedValue);
  }

  validate(value, settings) {
    return validateLength(value, this.toOnlyNumbers) || false;
  }

  getMask(value, settings) {
    return customMaskOptions(value).mask;
  }
}
