export interface ITags {
    start: null | { index: number, value: Date | null },
    due: null | { index: number, value: Date | null },
    afterTime: null | { index: number, value: number | null },
    beforeTime: null | { index: number, value: number | null },
    link: { index: number; value: string | null; } | null,
    duration: { index: number; value: number; } | null,
    repeats: { index: number; value: string; endIndex: number } | null
}

export interface ITagIndices {
    word: string,
    index: number
}

export default interface ITagExtractor {
    tags: ITags,
    occurences: ITagIndices[]
}
