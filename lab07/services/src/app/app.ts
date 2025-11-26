import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostFormComponent } from './post-form-component/post-form-component';
import { PostService } from './services/post/post';
import { Post } from './models/post.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PostFormComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('services');
  posts = signal<Post[]>([]);
  editing: Post | null = null;

  constructor(private postService: PostService) {
    this.loadPosts();
  }

  private loadPosts() {
    this.posts.set(this.postService.getPosts());
  }

  onSave(post: Post) {
    if (!post.id) {
      this.postService.addPost({ title: post.title, content: post.content });
    } else {
      this.postService.updatePost(post);
    }
    this.editing = null;
    this.loadPosts();
  }

  onEdit(post: Post) {
    this.editing = post;
  }

  onDelete(id: string) {
    if (!confirm('Na pewno usunąć post?')) return;
    this.postService.deletePost(id);
    this.loadPosts();
  }

  onCancel() {
    this.editing = null;
  }
}
