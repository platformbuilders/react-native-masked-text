export const MASKS_TYPE = {
  'account-bank': {
    regex: /(\d{1,100})(\d{1})/,
    mask: '$1-$2',
  },
};

export const replaceMaskRegex = (value, mask) => {
  if (!value || !mask) {
    return;
  }
  const newValue = value.match(/[a-zA-Z0-9]/g, '').join('');
  return MASKS_TYPE[mask].regex && MASKS_TYPE[mask].mask
    ? newValue.replace(MASKS_TYPE[mask].regex, MASKS_TYPE[mask].mask)
    : value;
};
