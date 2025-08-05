import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { PaginationDto } from "src/common/pagination.dto";
import mongoose from "mongoose";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  create(data: any) {
    if (data.roleId) {
      data.roleId = new mongoose.Types.ObjectId(data.roleId);
    }
    return this.userRepository.create(data);
  }

  findAll(filter: any, pagination: PaginationDto) {
    return this.userRepository.findAll(filter, pagination);
  }

  findById(id: string) {
    return this.userRepository.findOne({ _id: id });
  }

  update(id: string, updateData: any) {
    return this.userRepository.update({ _id: id }, updateData);
  }

  softDelete(id: string) {
    return this.userRepository.softDelete(id);
  }

  hardDelete(id: string) {
    return this.userRepository.hardDelete(id);
  }

  restore(id: string) {
    return this.userRepository.restore({ _id: id });
  }
}
