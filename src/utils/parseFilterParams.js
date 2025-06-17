const parseGender = (gender) => {
  if (typeof gender !== 'string') return;
  const allowedGenders = ['male', 'female', 'other'];

  return allowedGenders.includes(gender) ? gender : undefined;
};

const parseBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
};

const parseNumber = (value) => {
  if (typeof value !== 'string') return;

  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const parseFilterParams = (query) => {
  const { gender, minAge, maxAge, favorite } = query;

  return {
    gender: parseGender(gender),
    minAge: parseNumber(minAge),
    maxAge: parseNumber(maxAge),
    favorite: parseBoolean(favorite),
  };
};