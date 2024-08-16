import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) // InjectModel to use User model
    private readonly userModel: Model<User>,
  ) { }

  async findOne(email: string): Promise<User | undefined> {
    return await this.userModel.findOne({ email }).lean().exec();
  }

  async create(user: any): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async uploadPicture(picture: string, id: string) {
    await this.userModel.updateOne({
      _id: id
    }, {
      picture
    })
  }

  async updateUserProfilePicture(email: string, picturePath: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      { picture: picturePath, updated_at: new Date() },
      { new: true },
    );
    return updatedUser;
  }

}
