import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { UserModule } from "./users/user.module";
import { RoleModule } from "./roles/role.module";

import configuration, { AppConfig } from "./config/configuration";
import { CommonModule } from "./common/common.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration as () => AppConfig],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>("mongoUri"),
      }),
    }),
    CommonModule,
    RoleModule,
    UserModule,
  ],
})
export class AppModule {}
