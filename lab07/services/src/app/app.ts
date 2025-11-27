import { Component, signal, computed } from '@angular/core';
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

  pageSizeOptions = [1, 2, 5];
  pageSize = signal<number>(1);
  currentPage = signal<number>(1);

  visiblePosts = computed(() => {
    const all = this.posts();
    const size = this.pageSize();
    const page = Math.max(1, this.currentPage());
    const start = (page - 1) * size;
    return all.slice(start, start + size);
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.posts().length / this.pageSize())));

  constructor(private postService: PostService) {
    this.loadPosts();
  }

  private loadPosts() {
    this.posts.set(this.postService.getPosts());
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }

  onSave(post: Post) {
    if (!post.id) {
      const added = this.postService.addPost({ title: post.title, content: post.content });
      this.posts.update((prev) => [added, ...prev]);
    } else {
      const updated = this.postService.updatePost(post);
      this.posts.update((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    }
    this.editing = null;
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }

  onEdit(post: Post) {
    this.editing = post;
  }

  onDelete(id: string) {
    if (!confirm('Na pewno usunąć post?')) return;
    this.postService.deletePost(id);
    this.posts.update((prev) => prev.filter((p) => p.id !== id));
    if (this.currentPage() > this.totalPages()) {
      this.currentPage.set(this.totalPages());
    }
  }

  onCancel() {
    this.editing = null;
  }

  setPageSize(raw: any) {
    const n = Number(raw);
    if (isNaN(n) || n <= 0) return;
    this.pageSize.set(n);
    this.currentPage.set(1);
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) this.currentPage.set(this.currentPage() + 1);
  }

  prevPage() {
    if (this.currentPage() > 1) this.currentPage.set(this.currentPage() - 1);
  }

  trackById(_i: number, p: Post) {
    return p.id;
  }
}
