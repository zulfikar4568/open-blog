import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  ADMIN_PASS: env.get('ADMIN_PASS').required().asString(),
  ADMIN_EMAIL: env.get('ADMIN_EMAIL').required().asString(),
  ADMIN_CONTACT: env.get('ADMIN_CONTACT').required().asString(),

  GOOGLE_CLIENT_ID: env.get('GOOGLE_CLIENT_ID').required().asString(),
  GOOGLE_CLIENT_SECRET: env.get('GOOGLE_CLIENT_SECRET').required().asString(),
  GOOGLE_CALLBACK_URL: env.get('GOOGLE_CALLBACK_URL').required().asUrlString(),

  FB_CLIENT_ID: env.get('FB_CLIENT_ID').required().asString(),
  FB_CLIENT_SECRET: env.get('FB_CLIENT_SECRET').required().asString(),
  FB_CALLBACK_URL: env.get('FB_CALLBACK_URL').required().asUrlString(),

  JWT_SECRET: env.get('JWT_SECRET').required().asString(),
  ECRYPTED_SECRET: env.get('ECRYPTED_SECRET').required().asString(),
  JWT_EXPIRES_IN: env.get('JWT_EXPIRES_IN').default('3d').asString(),
  JWT_REFRESH_EXPIRES_IN: env
    .get('JWT_REFRESH_EXPIRES_IN')
    .default('30d')
    .asString(),
});
