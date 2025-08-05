import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schemas/user.schema";
import { UserRepository } from "./user.repository";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { RoleModule } from "src/roles/role.module";
import { Role, RoleSchema } from "src/roles/schemas/role.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    RoleModule,
  ],
  providers: [UserRepository, UserService],
  controllers: [UserController],
  exports: [UserRepository],
})
export class UserModule {}
