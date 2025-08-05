import {
  Controller,
  Get,
  Body,
  Param,
  Query,
  Patch,
  Post,
  Delete,
} from "@nestjs/common";
import { RoleService } from "./role.service";
import { PaginationDto } from "src/common/pagination.dto";
import { CreateRoleDto, UpdateRoleDto } from "./dtos/role.dto";
import { ResponseMessage } from "src/common/decorators/response-message.decorator";

@Controller("roles")
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  @ResponseMessage("Role created successfully")
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data);
  }

  @Get()
  @ResponseMessage("Roles fetched successfully")
  findAll(@Query() query: PaginationDto) {
    return this.roleService.findAll(query);
  }

  @Get(":id")
  @ResponseMessage("Role fetched successfully")
  findOne(@Param("id") id: string) {
    return this.roleService.findById(id);
  }

  @Patch(":id")
  @ResponseMessage("Role updated successfully")
  update(@Param("id") id: string, @Body() updateData: UpdateRoleDto) {
    return this.roleService.update(id, updateData);
  }

  @Delete(":id")
  softDelete(@Param("id") id: string) {
    return this.roleService.softDelete(id);
  }
}
