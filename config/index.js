require('dotenv').config()
module.exports = {
  web: {
    port: Number(process.env.PORT) || 5050
  },
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    ssl: process.env.DB_ENABLE_SSL === 'true'
      ? { rejectUnauthorized: false }
      : false
  },
  secret: {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '14d'
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  }
}
