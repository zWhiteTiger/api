import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
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

  async uploadSignature(signature: string, id: string): Promise<void> {
    await this.userModel.updateOne(
      { _id: id },
      { signature }
    );
  }


  async updateUserProfilePicture(email: string, picturePath: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      { picture: picturePath, updated_at: new Date() },
      { new: true },
    );
    return updatedUser;
  }

  // In users.service.ts

  async delete(userId: string): Promise<boolean> {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    return result.deletedCount > 0;
  }


  async updateUserSignature(email: string, signatureFilename: string): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      {
        signature: signatureFilename, // Save only filename
        updated_at: new Date()
      },
      { new: true },
    );
    return updatedUser;
  }
}
