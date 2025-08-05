// src/users/user.repository.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { AbstractRepository } from "../common/abstract.repository";
import { User } from "./schemas/user.schema";
import { RepositoryRegistryService } from "../common/repository-registry.service";

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  constructor(
    @InjectModel(User.name) model: Model<User>,
    registry: RepositoryRegistryService,
  ) {
    super(model, registry);
  }
}
