export interface ILanguage {
    sno: Number;
    title: string;
    langId: string;
}

export interface ILanguageListProps{
    languages: ILanguage[];
}
