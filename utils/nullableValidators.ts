export const isIntOrNull = (value: any) => {
  if (value === null) return true;
  try {
    parseInt(value);
    return true;
  } catch {
    return false;
  }
};

export const isFloatOrNull = (value: any) => {
  if (value === null) return true;
  try {
    parseFloat(value);
    return true;
  } catch {
    return false;
  }
};
