import BaseMask from './_base.mask';
import { replaceMaskRegex } from './maskInRegex';

function getDefaultTranslation() {
  return {
    9(val) {
      return val.replace(/[^0-9]+/g, '');
    },
    A(val) {
      return val.replace(/[^a-zA-Z]+/g, '');
    },
    S(val) {
      return val.replace(/[^a-zA-Z0-9]+/g, '');
    },
    '*': function (val) {
      return val;
    },
  };
}

function toPattern(value, mask, translation) {
  let result = '';

  let maskCharIndex = 0;
  let valueCharIndex = 0;

  while (true) {
    // if mask is ended, break.
    if (maskCharIndex === mask.length) {
      break;
    }

    // if value is ended, break.
    if (valueCharIndex === value.length) {
      break;
    }

    const maskChar = mask[maskCharIndex];
    const valueChar = value[valueCharIndex];

    // value equals mask, just set
    if (maskChar === valueChar) {
      result += maskChar;
      valueCharIndex += 1;
      maskCharIndex += 1;
      continue;
    }

    // apply translator if match
    const translationHandler = translation[maskChar];

    if (translationHandler) {
      const resolverValue = translationHandler(valueChar || '');
      if (resolverValue === '') {
        // valueChar replaced so don't add it to result, keep the mask at the same point and continue to next value char
        valueCharIndex += 1;
        continue;
      } else if (resolverValue !== null) {
        result += resolverValue;
        valueCharIndex += 1;
      } else {
        result += maskChar;
      }
      maskCharIndex += 1;
      continue;
    }

    // not masked value, fixed char on mask
    result += maskChar;
    maskCharIndex += 1;
    continue;
  }

  return result;
}

const DEFAULT_TRANSLATION = getDefaultTranslation();

export default class CustomMask extends BaseMask {
  static getType() {
    return 'custom';
  }

  static getDefaultTranslation() {
    return getDefaultTranslation();
  }

  static shared = new CustomMask();

  getKeyboardType() {
    return 'default';
  }

  getValue(value, settings) {
    let masked = '';

    if (value === '') {
      return value;
    }

    if (settings.type) {
      masked = replaceMaskRegex(value, settings.type);
    } else {
      const { mask } = settings;
      const translation = this.mergeSettings(
        DEFAULT_TRANSLATION,
        settings.translation,
      );
      masked = toPattern(value, mask, translation);
    }
    return masked;
  }

  getRawValue(maskedValue, settings) {
    if (!!settings && settings.getRawValue) {
      return settings.getRawValue(maskedValue, settings);
    }

    return maskedValue;
  }

  validate(value, settings) {
    if (!!settings && settings.validator) {
      return settings.validator(value, settings);
    }

    return true;
  }
}
