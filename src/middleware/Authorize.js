import TryCatch from '../decorators/TryCatchMiddlewareDecorator';
import HttpError from '../exeptions/HttpError';
import { verifyAuthToken, createAuthToken } from '../helpers/auth';
import User from '../models/User';


class Authorize {
  @TryCatch
  static async check(req, res, next) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const device = req.headers['user-agent'];

      console.log('Из заголовка запроса приходит токен', token);

      if (!token) {
        throw new HttpError('Access token not found in request', 400);
      }

      const verifyData = verifyAuthToken(token);

      console.log('Происходит проверка токена на валидность', verifyData);

      if (!verifyData) {
        throw new HttpError('Token invalid or expired', 401);
      }

      // ======================== Добавлена проверка захождения с того же клиента
      if (verifyData.device !== device) {
        throw new HttpError('Нужно залогиниться с этого устройства', 401);
      }

      console.log(verifyData.device);

      console.log(
        `Если токе валидный, то в ответе функции верификации возвращается объект,
         внутри которого мы забираем поле id, которое является идентификатором нашего пользователя. userId: ${verifyData.id}.
         Затем этот идентификатор присвается параметрам нашего запроса`,
      );
      req.userId = verifyData.id;

      // ============================== Получение новых токенов и передача их дальше ==========>

      const user = await User.findById(verifyData.id);

      if (token === user.refreshToken) {
        const { tokenCount } = user;

        user.tokenDevice = req.headers['user-agent'];

        user.tokenCount = !tokenCount || tokenCount > 5000 ? 1 : +tokenCount + 1;

        await user.save();

        const { tokenDevice } = user;

        console.log(tokenCount, tokenDevice);
        console.log(user);
        // console.log(req.headers['user-agent']);

        /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
        const [authToken, tokenRefresh] = await createAuthToken({
          id: String(user._id),
          count: tokenCount,
          device: tokenDevice,
        });

        user.tokenRefresh = tokenRefresh;
        await user.save();

        console.log('authToken обновление------>', authToken);

        req.tokens = {
          access_token: authToken,
          refresh_token: tokenRefresh,
          expires_in: 'time',
        };
      } else {
        req.tokens = {
          tokensUpdate: false,
        };
      }

      return next();
    }
    throw new HttpError('Unauthorized', 401);
  }
}

export default Authorize;
