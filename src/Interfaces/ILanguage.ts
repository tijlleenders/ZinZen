export interface ILanguage {
  sno: number;
  title: string;
  langId: string;
}

export interface ILanguageListProps {
  languages: ILanguage[];
}
