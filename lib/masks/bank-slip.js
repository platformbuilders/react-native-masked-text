import BaseMask from './_base.mask';
import CustomMask from './custom.mask';

const MASK_BANK_SLIP_COMMON = '99999.99999\n99999.999999\n99999\n999999\n9\n99999999999999';
const MASK_BANK_SLIP_ANOTHER = '99999999999\n9\n99999999999\n9\n99999999999\n9\n99999999999\n9';

const customMaskOptions = (value) => {
  if (value && value.replace(/\W/g, '').length > 47) {
    return { mask: MASK_BANK_SLIP_ANOTHER };
  }
  return { mask: MASK_BANK_SLIP_COMMON };
};

export default class DocumentMask extends BaseMask {
  static getType() {
    return 'bank-slip';
  }

  getValue(value) {
    return CustomMask.shared.getValue(value, customMaskOptions(value));
  }

  getRawValue(maskedValue) {
    return super.removeNotNumbers(maskedValue);
  }

  validate(value) {
    return !!value || false;
  }

  getMask(value) {
    return customMaskOptions(value).mask;
  }
}
