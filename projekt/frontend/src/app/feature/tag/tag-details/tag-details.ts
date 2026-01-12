import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, RouterOutlet } from '@angular/router';
import { TagsService } from '../tag.service';
import { UUIDTypes } from 'uuid';
import { CommonModule } from '@angular/common';
import { CategoryColorService } from '../../category-color.service';
import { CategoryColor } from '../../../shared/enums/CategoryColor';
import { Tag } from '../../../interface/tag/Tag';
import { ConfirmationService } from '../../../core/services/confirmation.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-tag-details',
  imports: [RouterOutlet, CommonModule, MatIconModule],
  templateUrl: './tag-details.html',
  styleUrl: './tag-details.scss',
})
export class TagDetailsComponent implements OnInit {
  private categoryColorService = inject(CategoryColorService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private tagsService = inject(TagsService);
  private confirmationService = inject(ConfirmationService);
  public tag?: Tag;
  public tags: Tag[] | [] = [];
  public currentIndex?: number;

  public ngOnInit(): void {
    this.tags = this.tagsService.getTags();
    this.route.params.subscribe((params: Params) => {
      const id = params['id'] as UUIDTypes;
      this.tag = this.tags.find((tag) => tag.id === id);
      this.currentIndex = this.tagsService.getTagIndexById(id);
    });
  }

  public goBack(): void {
    this.router.navigate(['tags']);
  }

  public nextTag(): void {
    if (!this.tag || this.currentIndex === undefined) {
      return;
    }

    if (this.currentIndex === this.tags.length - 1) {
      return;
    }

    this.router.navigate(['tags', this.tags[this.currentIndex + 1].id, 'details']);
  }

  public previousTag(): void {
    if (!this.tag || this.currentIndex === undefined) {
      return;
    }

    if (this.currentIndex === 0) {
      return;
    }

    this.router.navigate(['tags', this.tags[this.currentIndex - 1].id, 'details']);
  }

  public isFirstTag(): boolean {
    return !this.tag || this.currentIndex === 0;
  }

  public isLastTag(): boolean {
    return !this.tag || this.currentIndex === this.tags.length - 1;
  }

  public goToTagForm(tag: Tag): void {
    this.router.navigate([tag.id, 'form'], { relativeTo: this.route.parent });
  }

  public deleteTag(tagId: UUIDTypes): void {
    if (this.currentIndex === undefined) {
      return;
    }
    
    this.confirmationService.confirmDanger(
      'Delete tag',
      `Are you sure you want to delete the tag "${this.tag?.name}"? This action is irreversible.`
    ).subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }
      
      const nextIndex = this.currentIndex! < this.tags.length - 1 
        ? this.currentIndex! 
        : this.currentIndex! - 1;
      
      this.tagsService.deleteTag(tagId).subscribe({
        next: () => {          
          if (nextIndex >= 0 && this.tags.length > 1) {
            const nextTag = this.tags[nextIndex === this.currentIndex ? nextIndex + 1 : nextIndex];
            this.router.navigate(['tags', nextTag.id, 'details']);
          } else {
            this.router.navigate(['tags']);
          }
        },
        error: () => {
          // Error already handled in service
        }
      });
    });
  }

  public getTagBackgroundColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveCategoryColor(categoryColor);
  }
  
  public getTagTextColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveTextColor(categoryColor);
  }
}
