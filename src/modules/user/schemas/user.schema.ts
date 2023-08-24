import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { USER_ROLES } from '../../../common/enum';

import appConfig from '../../../config/app.config';

export type UserSchema = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ default: null })
  name: string;

  @Prop({ default: null, unique: true })
  email: string;

  @Prop({ default: null })
  password: string;

  @Prop({ type: 'string', enum: USER_ROLES, default: USER_ROLES.USER })
  role: USER_ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.encryptPassword = async function (
  password: string,
): Promise<string> {
  return bcrypt.hashSync(password, appConfig().saltRounds);
};

UserSchema.methods.validatePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compareSync(password, this.password);
};
