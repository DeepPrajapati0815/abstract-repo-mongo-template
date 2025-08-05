import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { AbstractDocument } from "src/common/abstract/abstract.schema";
import { Types } from "mongoose";

@Schema({ timestamps: true })
export class User extends AbstractDocument {
  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^\S+@\S+\.\S+$/,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
    minlength: 8,
  })
  passwordHash: string;

  @Prop({
    type: Types.ObjectId,
    ref: "Role",
    required: true,
  })
  roleId: Types.ObjectId;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
