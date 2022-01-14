import TryCatch from '../decorators/TryCatchMiddlewareDecorator';
import HttpError from '../exeptions/HttpError';
import { verifyAuthToken } from '../helpers/auth';

class Authorize {
  @TryCatch
  static async check(req, res, next) {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];

      console.log('Из заголовка запроса приходит токен', token);

      if (!token) {
        throw new HttpError('Access token not found in request', 400);
      }

      const verifyData = verifyAuthToken(token);

      console.log('Происходит проверка токена на валидность', verifyData);

      if (!verifyData) {
        throw new HttpError('Token invalid or expired', 401);
      }

      console.log(
        `Если токе валидный, то в ответе функции верификации возвращается объект,
         внутри которого мы забираем поле id, которое является идентификатором нашего пользователя. userId: ${verifyData.id}.
         Затем этот идентификатор присвается параметрам нашего запроса`,
      );
      req.userId = verifyData.id;
      return next();
    }
    throw new HttpError('Unauthorized', 401);
  }
}

export default Authorize;
