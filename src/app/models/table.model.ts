export interface TableColumn {
  key: any;
  label: any;
  sortable?: boolean;
  type?: 'text' | 'badge' | 'image' | 'custom'| 'currency' | 'date';
}

export interface TableAction {
  label: any;
  icon: any;
  callback: (row: any) => void;
  condition?: (row: any) => void; 
  color?: any; // ex: 'text-red-500' pour supprimer
}