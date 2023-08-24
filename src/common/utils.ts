export const removeFields = async (obj, keys: Array<string> = []) => {
  keys.push(
    'password',
    'isDeleted',
    'deletedBy',
    'deletedAt',
    'createdAt',
    'updatedAt',
    '__v',
  );

  for (const key in obj) {
    if (typeof obj[key] === 'object') await removeFields(obj[key], keys);

    if (keys.includes(key)) delete obj[key];
  }
  return obj;
};

export const toJSON = (obj: object) => {
  return JSON.parse(JSON.stringify(obj));
};
