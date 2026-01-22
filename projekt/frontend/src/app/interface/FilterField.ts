export interface FilterOption {
  readonly id: string;
  readonly label: string;
};

export interface FilterField {
  readonly id: string;
  readonly label: string;
  readonly type: 'text' | 'checkbox' | 'select' | 'date';
  readonly options?: FilterOption[];
};
