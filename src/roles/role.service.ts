import { Injectable } from "@nestjs/common";
import { RoleRepository } from "./repositories/role.repository";
import { PaginationDto } from "src/common/pagination.dto";
import { CreateRoleDto, UpdateRoleDto } from "./dtos/role.dto";
import mongoose from "mongoose";

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  create(data: CreateRoleDto) {
    return this.roleRepository.create(data);
  }

  findAll(pagination: PaginationDto) {
    return this.roleRepository.findAll({}, pagination);
  }

  findById(id: string) {
    return this.roleRepository.findOne({ _id: id });
  }

  update(id: string, updateData: UpdateRoleDto) {
    return this.roleRepository.update({ _id: id }, updateData);
  }

  softDelete(id: string) {
    return this.roleRepository.softDelete(id);
  }

  restore(id: string) {
    return this.roleRepository.restore({
      _id: new mongoose.Types.ObjectId(id),
    });
  }

  hardDelete(id: string) {
    return this.roleRepository.hardDelete(id);
  }
}
