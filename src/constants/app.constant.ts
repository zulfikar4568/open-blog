import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  ADMIN_PASS: env.get('ADMIN_PASS').required().asString(),
  ADMIN_EMAIL: env.get('ADMIN_EMAIL').required().asString(),
  ADMIN_CONTACT: env.get('ADMIN_CONTACT').required().asString(),
  CLIENT_ID: env.get('CLIENT_ID').required().asString(),
  CLIENT_SECRET: env.get('CLIENT_SECRET').required().asString(),
  CALLBACK_URL: env.get('CALLBACK_URL').required().asUrlString(),

  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  ECRYPTED_SECRET: env.get('ECRYPTED_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('3d').asString(),
  JWT_REFRESH_EXPIRES_IN: env
    .get('JWT_REFRESH_EXPIRES_IN')
    .default('30d')
    .asString(),
});
