import * as bcrypt from 'bcrypt';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CallbackError } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true, unique: true })
  username: string;
  @Prop({ required: true, unique: true })
  email: string;
  @Prop()
  password: string;
  @Prop()
  provider: string;
  @Prop()
  providerId: string;
  @Prop()
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (next) {
  try {
    const refreshToken = this.get('refreshToken');
    if (this.password) {
      const hashed: string = await bcrypt.hash(refreshToken, 16);
      this.set({ refreshToken: hashed });
    }

    return next();
  } catch (err: any) {
    return next(err as CallbackError);
  }
});

UserSchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret['password'];
    return ret;
  },
});
