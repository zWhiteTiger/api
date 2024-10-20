import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dto/update-user.dto';

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
    await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        picture,
      },
    );
  }

  async uploadSignature(signature: string, id: string): Promise<void> {
    await this.userModel.updateOne({ _id: id }, { signature });
  }

  async updateUserProfilePicture(
    email: string,
    picturePath: string,
  ): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      { picture: picturePath, updated_at: new Date() },
      { new: true },
    );
    return updatedUser;
  }

  async searchUsers(searchTerm: string) {
    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search
    console.log(`Searching for users with term: ${searchTerm}`);

    const results = await this.userModel
      .find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { email: { $regex: regex } },
        ],
      })
      .exec();

    console.log(`Found users: ${results.length}`);
    return results;
  }

  async updateUserSignature(
    email: string,
    signatureFilename: string,
  ): Promise<User> {
    const updatedUser = await this.userModel.findOneAndUpdate(
      { email },
      {
        signature: signatureFilename, // Save only filename
        updated_at: new Date(),
      },
      { new: true },
    );
    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await this.userModel
        .find()
        .select('email role firstName lastName birthDate picture department');

      return users;
    } catch (error) {
      throw new Error();
    }
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    try {
      const hash = bcrypt.hashSync(newPassword, 8);
      return await this.userModel.findByIdAndUpdate(
        { _id: userId },
        { $set: { password: hash } },
        { new: true },
      );
    } catch (error) {
      throw new Error();
    }
  }

  async updateUserDetails(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ...updateUserDto, updated_at: new Date() },
      { new: true },
    );

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async deleteUser(_id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(_id);
  }
}
