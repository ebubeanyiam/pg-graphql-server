import { Arg, Ctx, Field, InputType, Mutation, ObjectType } from "type-graphql";
import { RequiredEntityData } from "@mikro-orm/core";
import argon from "argon2";

import { Context } from "../types";
import { User } from "../entities/user";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

export class UserResolver {
  //   @Query(() => [Post])
  //   posts(@Ctx() { em }: Context): Promise<Post[]> {
  //     return em.find(Post, {});
  //   }

  @Mutation(() => User)
  async register(
    @Arg("args") { username, password: _password }: UsernamePasswordInput,
    @Ctx() { em }: Context
  ): Promise<User> {
    const password = await argon.hash(_password);
    const user = em.create(User, {
      username,
      password,
    } as RequiredEntityData<User>);
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("args") { username, password }: UsernamePasswordInput,
    @Ctx() { em }: Context
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Username does not exist",
          },
        ],
      };
    }
    const valid = await argon.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password",
          },
        ],
      };
    }

    return { user };
  }
}
