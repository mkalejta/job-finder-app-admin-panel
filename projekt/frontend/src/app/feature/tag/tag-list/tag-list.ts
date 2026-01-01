import { Component, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { UUIDTypes } from 'uuid';
import { TagsService } from '../tag.service';
import { CommonModule } from '@angular/common';
import { CategoryColorService } from '../../category-color.service';
import { CategoryColor } from '../../../shared/enums/CategoryColor';

@Component({
  selector: 'app-tag-list',
  imports: [CommonModule],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.scss',
})
export class TagList implements OnInit {
  private categoryColorService = inject(CategoryColorService);
  private tagsService = inject(TagsService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  tags = toSignal(this.tagsService.tags$, { initialValue: [] });

  ngOnInit(): void {
    this.tagsService.loadTags();
  }

  goToAddTag(): void {
    this.router.navigate(['form'], { relativeTo: this.route });
  }

  goToTagDetails(tagId: UUIDTypes): void {
    this.router.navigate([tagId, 'details'], { relativeTo: this.route });
  }

  getTagBackgroundColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveCategoryColor(categoryColor);
  }

  getTagTextColor(categoryColor: CategoryColor): string {
    return this.categoryColorService.resolveTextColor(categoryColor);
  }
}
