import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Patch,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { PaginationDto } from "src/common/pagination.dto";
import { ResponseMessage } from "src/common/decorators/response-message.decorator";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() data: any) {
    return this.userService.create(data);
  }

  @Get()
  @ResponseMessage("User list fetched successfully")
  findAll(@Query() query: PaginationDto) {
    return this.userService.findAll({}, query);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.userService.findById(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateData: any) {
    return this.userService.update(id, updateData);
  }

  @Delete(":id")
  softDelete(@Param("id") id: string) {
    return this.userService.softDelete(id);
  }

  @Get(":id/restore")
  restore(@Param("id") id: string) {
    return this.userService.restore(id);
  }

  @Delete(":id/hard")
  hardDelete(@Param("id") id: string) {
    return this.userService.hardDelete(id);
  }
}
