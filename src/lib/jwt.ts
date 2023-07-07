import { SECRET_KEY, MESSAGES, EXPIRETIME } from './../config/constants';
import jwt from 'jsonwebtoken';
import { IJwt } from '../interfaces/jwt.interface';

class JWT {
  private secretKey = SECRET_KEY as string;
  sign(data: IJwt, expiresIn: number = EXPIRETIME.H24) {
    // 24 horas de caducidad
    return jwt.sign(
      {
        user: data.user,
      },
      this.secretKey,
      { expiresIn }
    );
  }

  verify(token: string) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('token:::', token);
      console.log('Verifiy-key', this.secretKey);
    }
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return MESSAGES.TOKEN_VERIFICATION_FAILT;
    }
  }
}

export default JWT;
