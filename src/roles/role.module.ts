import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Role, RoleSchema } from "./schemas/role.schema";
import { RoleRepository } from "./repositories/role.repository";
import { RoleService } from "./role.service";
import { RoleController } from "./role.controller";
import { UserModule } from "src/users/user.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Role.name,
        schema: RoleSchema,
      },
    ]),
    forwardRef(() => UserModule),
  ],
  providers: [RoleRepository, RoleService],
  controllers: [RoleController],
  exports: [RoleRepository],
})
export class RoleModule {}
