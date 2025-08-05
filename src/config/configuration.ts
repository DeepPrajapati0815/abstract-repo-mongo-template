export interface AppConfig {
  port: number;
  mongoUri: string;
  jwtSecret: string;
}

const configuration = (): AppConfig => ({
  port: parseInt(process.env.PORT || "3000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mmta-db",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
});

export default configuration;
