import { ChangeEvent, ReactNode } from "react";
import { SetterOrUpdater } from "recoil";

export interface IHeader {
    title: string,
    debounceSearch?: (event: ChangeEvent<HTMLInputElement>) => void
}

export interface ZAccordionProps {
    style: React.CSSProperties | undefined,
    panels: { header: string, body: ReactNode | ReactNode[] }[]
    showCount: boolean,
    defaultActiveKey?: string[]
}
export interface ColorPaletteProps {
    colorIndex: number,
    setColorIndex: SetterOrUpdater<number>
}
