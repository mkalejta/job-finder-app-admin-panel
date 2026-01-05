import { Injectable } from '@angular/core';
import { CategoryColor } from '../shared/enums/CategoryColor';

@Injectable({
  providedIn: 'root',
})
export class CategoryColorService {
  private readonly categoryColorMap: Record<CategoryColor, string> = {
    [CategoryColor.BLUE]: '#60a5fa',
    [CategoryColor.RED]: '#ef4444',
    [CategoryColor.GREEN]: '#10b981',
    [CategoryColor.YELLOW]: '#fbbf24',
    [CategoryColor.PURPLE]: '#a855f7',
    [CategoryColor.ORANGE]: '#f97316',
    [CategoryColor.BROWN]: '#92400e',
    [CategoryColor.GRAY]: '#6b7280',
    [CategoryColor.LIGHT_GRAY]: '#d1d5db',
    [CategoryColor.CYAN]: '#06b6d4',
    [CategoryColor.PINK]: '#ec4899',
    [CategoryColor.LIME]: '#84cc16',
    [CategoryColor.MAGENTA]: '#c026d3',
    [CategoryColor.BLACK]: '#111827',
    [CategoryColor.WHITE]: '#f9fafb',
  };
  
  resolveCategoryColor(color: CategoryColor): string {
    return this.categoryColorMap[color] ?? '#f5f5f5';
  }

  resolveTextColor(color: CategoryColor): string {
    const hex = this.resolveCategoryColor(color).replace('#', '');
    const [r, g, b] = [0, 2, 4].map((start) => parseInt(hex.substring(start, start + 2), 16));
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.65 ? '#1a1a1a' : '#ffffff';
  }
}
