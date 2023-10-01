import { ChangeEvent, ReactNode } from "react";

export interface AppLayoutProps {
  title: string;
  children: ReactNode;
  debounceSearch?: (event: ChangeEvent<HTMLInputElement>) => void;
}
