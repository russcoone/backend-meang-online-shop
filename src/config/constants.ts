import environment from './environments';

if (process.env.NODE_ENV !== 'production') {
  const env = environment;
}

export const SECRET_KEY =
  process.env.SECRET || 'abrahamcomservicetiendaOnlineGraphql';

export enum COLLECTION {
  USERS = 'users',
  GENRES = 'genres',
  // GENRE = 'genre',
  TAGS = 'tags',
}

export enum MESSAGES {
  TOKEN_VERIFICATION_FAILT = 'token no valido inicia sesion de nuevo',
}

export enum EXPIRETIME {
  H1 = 60 * 60,
  H24 = 24 * H1,
  M1 = H1 / 4,
  M20 = H1 / 3,
  D3 = H24 * 3,
}
export enum ACTIVE_VALUES_FILTER {
  ALL = 'ALL',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum SUBSCRIPTIONS_EVENT {
  UPDATE_STOCK_PRODUCT = 'UPDATE_STOCK_PRODUCT',
}
