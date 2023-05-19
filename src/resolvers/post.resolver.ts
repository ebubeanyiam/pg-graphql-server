import { Arg, Ctx, Mutation, Query } from "type-graphql";
import { RequiredEntityData } from "@mikro-orm/core";

import { Context } from "../types";
import { Post } from "../entities/post";

export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: Context): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(@Arg("id") id: number, @Ctx() { em }: Context): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg("title") title: string,
    @Ctx() { em }: Context
  ): Promise<Post> {
    const post = em.create(Post, { title } as RequiredEntityData<Post>);
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg("id") id: number,
    @Arg("title") title: string,
    @Ctx() { em }: Context
  ): Promise<Post | null> {
    const post = await em.findOne(Post, { id });
    if (!post) return null;
    if (title) {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg("id") id: number,
    @Ctx() { em }: Context
  ): Promise<Boolean> {
    em.nativeDelete(Post, { id });
    return true;
  }
}
