import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TagsService } from '../tag.service';
import { UUIDTypes } from 'uuid';
import { CommonModule } from '@angular/common';
import { CategoryColorService } from '../../category-color.service';
import { CategoryColor } from '../../../shared/enums/CategoryColor';
import Tag from '../../../interface/tag/Tag';
import { ConfirmationService } from '../../../core/services/confirmation.service';

@Component({
  selector: 'app-tag-details',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './tag-details.html',
  styleUrl: './tag-details.scss',
})
export class TagDetails implements OnInit {
  private categoryColorService = inject(CategoryColorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tagsService = inject(TagsService);
  private confirmationService = inject(ConfirmationService);
  tag?: Tag;
  tags: Tag[] | [] = [];
  currentIndex?: number;

  ngOnInit(): void {
    this.tags = this.tagsService.getTags();
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.tag = this.tags.find((tag) => tag.id === id);
      this.currentIndex = this.tagsService.getTagIndexById(id);
    });
  }

  goBack(): void {
    this.router.navigate(['tags']);
  }

  nextTag(): void {
    if (!this.tag || this.currentIndex === undefined) return;
    if (this.currentIndex === this.tags.length - 1) return;
    this.router.navigate(['tags', this.tags[this.currentIndex + 1].id, 'details']);
  }

  previousTag(): void {
    if (!this.tag || this.currentIndex === undefined) return;
    if (this.currentIndex === 0) return;
    this.router.navigate(['tags', this.tags[this.currentIndex - 1].id, 'details']);
  }

  isFirstTag(): boolean {
    return !this.tag || this.currentIndex === 0;
  }

  isLastTag(): boolean {
    return !this.tag || this.currentIndex === this.tags.length - 1;
  }

  goToTagForm(tag: Tag): void {
    this.router.navigate([tag.id, 'form'], { relativeTo: this.route.parent });
  }

  deleteTag(tagId: UUIDTypes): void {
    if (this.currentIndex === undefined) return;
    
    this.confirmationService.confirmDanger(
      'Delete tag',
      `Are you sure you want to delete the tag "${this.tag?.name}"? This action is irreversible.`
    ).subscribe(confirmed => {
      if (!confirmed) return;
      
      const nextIndex = this.currentIndex! < this.tags.length - 1 
        ? this.currentIndex! 
        : this.currentIndex! - 1;
      
      this.tagsService.deleteTag(tagId);
      
      if (nextIndex >= 0 && this.tags.length > 1) {
        const nextTag = this.tags[nextIndex === this.currentIndex ? nextIndex + 1 : nextIndex];
        this.router.navigate(['tags', nextTag.id, 'details']);
      } else {
        this.router.navigate(['tags']);
      }
    });
  }

  getTagBackgroundColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveCategoryColor(categoryColor);
  }
  
  getTagTextColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveTextColor(categoryColor);
  }
}
