import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  ADMIN_PASS: env.get('ADMIN_PASS').required().asString(),
  ADMIN_EMAIL: env.get('ADMIN_EMAIL').required().asString(),
  ADMIN_CONTACT: env.get('ADMIN_CONTACT').required().asString(),
});
