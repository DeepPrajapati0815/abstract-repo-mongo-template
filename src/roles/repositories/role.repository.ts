// src/roles/role.repository.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "src/common/abstract/abstract.repository";
import { Role } from "../schemas/role.schema";
import { RepositoryRegistryService } from "src/common/abstract/repository-registry.service";
import { Cascade } from "src/common/decorators/cascade.decorator";

@Injectable()
@Cascade({ foreignKey: "roleId", repository: "UserRepository" })
export class RoleRepository extends AbstractRepository<Role> {
  constructor(
    @InjectModel(Role.name) model: Model<Role>,
    registry: RepositoryRegistryService,
  ) {
    super(model, registry);

    registry.setCascadeFields(this.constructor.name, ["UserRepository"]);
  }
}
