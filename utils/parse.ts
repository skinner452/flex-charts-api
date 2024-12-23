export const parseBoolOrUndefined = (value: string | undefined) => {
  if (value === "true" || value === "1") {
    return true;
  }

  if (value === "false" || value === "0") {
    return false;
  }

  return undefined;
};

export const parseIntOrUndefined = (value: string | undefined) => {
  if (!value) return undefined;

  try {
    return parseInt(value, 10);
  } catch {
    return undefined;
  }
};
