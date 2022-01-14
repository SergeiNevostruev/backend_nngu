import bcrypt from 'bcryptjs';

export const checkPassword = async (password, passwordHash) => {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (e) {
    throw new Error(e.message);
  }
};

export const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  } catch (e) {
    throw new Error(e.message);
  }
};
