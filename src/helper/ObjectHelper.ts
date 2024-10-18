export const getObjectValue = (obj: any, fieldPath: string) => {
  if (!obj) {
    return undefined;
  }
  const rawName = fieldPath.split('.');
  for (let i = 0; i < rawName.length - 1; i += 1) {
    const element = rawName[i];
    obj = obj[element];
  }
  return obj[rawName[rawName.length - 1]];
};

export const setObjectValue = (obj:any, path: string, value: any) => {
  const rawName = path.split('.');
  const rawNameLength = rawName.length;
  let set = false;
  rawName.forEach((key, index) => {
    if (obj && index < rawNameLength - 1) {
      obj = obj[key];
    }
    if (obj && index === rawNameLength - 1) {
      obj[key] = value;
      set = true;
    } else {
      //
    }
  });
  if (!set) {
    console.warn('Cannot set object field: ', path);
  }
};
