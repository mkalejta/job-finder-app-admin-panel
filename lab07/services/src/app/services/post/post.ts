import { Injectable } from '@angular/core';
import { Post } from './../../models/post.model';

const STORAGE_KEY = 'mini-blog-posts';

@Injectable({ providedIn: 'root' })
export class PostService {
  private readStorage(): Post[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const data = JSON.parse(raw) as Post[];
      return data;
    } catch (e) {
      console.error('Failed to read posts from storage', e);
      return [];
    }
  }

  private writeStorage(posts: Post[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Failed to write posts to storage', e);
    }
  }

  getPosts(): Post[] {
    const posts = this.readStorage();
    return posts.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }

  getTotalCount(): number {
    return this.readStorage().length;
  }

  addPost(post: Omit<Post, 'id' | 'createdAt' | 'modifiedAt'>): Post {
    const now = new Date().toISOString();
    const newPost: Post = {
      id: this.makeId(),
      title: post.title,
      content: post.content,
      createdAt: now,
      modifiedAt: now,
    };
    const posts = this.readStorage();
    posts.push(newPost);
    this.writeStorage(posts);
    return newPost;
  }

  updatePost(updated: Post): Post {
    const posts = this.readStorage();
    const idx = posts.findIndex((p) => p.id === updated.id);
    if (idx === -1) throw new Error('Post not found');
    updated.modifiedAt = new Date().toISOString();
    posts[idx] = updated;
    this.writeStorage(posts);
    return updated;
  }

  deletePost(id: string) {
    const posts = this.readStorage();
    const next = posts.filter((p) => p.id !== id);
    this.writeStorage(next);
  }

  private makeId(): string {
    return Math.random().toString(36).slice(2, 9);
  }
}
