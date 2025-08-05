import {
  IsString,
  IsOptional,
  IsBoolean,
  Length,
  Matches,
  MaxLength,
} from "class-validator";
import { Transform } from "class-transformer";
import { PartialType } from "@nestjs/mapped-types";

export class CreateRoleDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[A-Za-z0-9 _-]+$/, {
    message:
      "Name can only contain letters, numbers, spaces, underscores, and hyphens",
  })
  @Transform(({ value }) => value?.trim())
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => value?.trim())
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}
