export interface FabMenuOption {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export interface FabMenuConfig {
  show: boolean;
  onLongPress: () => void;
  options: FabMenuOption[];
}
