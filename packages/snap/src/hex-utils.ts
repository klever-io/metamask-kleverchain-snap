export const removeHexPrefix = (hexString: string): string => {
  if (hexString.startsWith('0x')) {
    return hexString.slice(2);
  }
  return hexString;
};

export const toHex = (str: string): string => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    result += str.charCodeAt(i).toString(16);
  }
  return result;
};
