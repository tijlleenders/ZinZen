export interface ILanguage {
  sno: number;
  title: string;
  langId: string;
  selected: boolean;
}

export interface ILanguageListProps {
  languages: ILanguage[];
  navigationCallback?: (path: string) => void;
  type: string;
  hideSelected?: boolean;
}
