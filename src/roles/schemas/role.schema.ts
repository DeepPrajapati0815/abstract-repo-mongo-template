import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "src/common/abstract/abstract.schema";

@Schema({ timestamps: true })
export class Role extends AbstractDocument {
  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
    match: /^[A-Za-z0-9 _-]+$/,
    unique: true,
  })
  name: string;

  @Prop({
    type: String,
    trim: true,
    maxlength: 255,
    default: "",
  })
  description: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
