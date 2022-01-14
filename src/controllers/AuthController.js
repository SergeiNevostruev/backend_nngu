import User from '../models/User';
import TryCatch from '../decorators/TryCatchMiddlewareDecorator';
import HttpError from '../exeptions/HttpError';
import { hashPassword, checkPassword } from '../helpers/password';
import { createAuthToken } from '../helpers/auth';

class AuthController {
  @TryCatch
  static async signin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await checkPassword(password, user.password))) {
      throw new HttpError('Incorrect login or password', 401);
    }

    const { tokenCount } = user;

    user.tokenDevice = req.headers['user-agent'];

    user.tokenCount = !tokenCount || tokenCount > 5000 ? 1 : +tokenCount + 1;

    await user.save();

    const { tokenDevice } = user;

    console.log(tokenCount, tokenDevice);

    // console.log(req.headers['user-agent']);

    /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
    const [authToken, tokenRefresh] = await createAuthToken({
      id: String(user._id),
      count: tokenCount,
      device: tokenDevice,
    });

    user.refreshToken = tokenRefresh;
    await user.save();

    console.log(user);
    console.log('authToken------>', authToken);

    res.json({
      status: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      tokens: {
        access_token: authToken,
        refresh_token: tokenRefresh,
        expires_in: 'time',
      },
    });
  }

  @TryCatch
  static async signup(req, res) {
    const model = new User({
      name: req.body.name,
      email: req.body.email,
      password: await hashPassword(req.body.password),
      tokenCount: '0',
      tokenDevice: req.headers['user-agent'],
    });

    const user = await model.save();

    res.json({
      status: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  }
}

export default AuthController;
