import jwt from 'jsonwebtoken';

export const createAuthToken = async (payload) => {
  try {
    const options = {
      algorithm: 'HS512',
      expiresIn: 200,
    };

    const optionsRefresh = {
      algorithm: 'HS512',
      expiresIn: 500,
    };

    const token = await jwt.sign(payload, 'auth', options);

    const tokenRefresh = await jwt.sign(payload, 'auth', optionsRefresh);

    return [token, tokenRefresh];
  } catch (error) {
    throw new Error(error.message);
  }
};

export const verifyAuthToken = (token) => {
  try {
    const data = jwt.verify(token, 'auth');
    console.log(data);
    return data;
  } catch (error) {
    return false;
  }
};
