export interface FilterOption {
  id: string;
  label: string;
};

export interface FilterField {
  id: string;
  label: string;
  type: 'text' | 'checkbox' | 'select' | 'date';
  options?: FilterOption[];
};
