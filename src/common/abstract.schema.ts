import { Prop, Schema } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class AbstractDocument extends Document {
  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: null })
  deletedAt: Date;
}
