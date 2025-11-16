import React, { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { i18n } from "@src/translations/i18n";

import { languageSelectionState } from "@src/store";
import "./index.scss";
import { LanguagesList } from "@components/LanguageChoice/LanguagesList";
import { getLanguages } from "@src/constants/languages";
import ZModal from "@src/common/ZModal";

export const LanguageChangeModal = ({ open }: { open: boolean }) => {
  if (!open) return null;

  const isLanguageChosen = useRecoilValue(languageSelectionState);
  const allLanguages = getLanguages();

  const sortedLanguages = useMemo(() => {
    const activeLang = i18n.language;

    const selected = allLanguages.filter((l) => activeLang.includes(l.langId));
    const others = allLanguages.filter((l) => !activeLang.includes(l.langId));

    return [
      ...selected.map((l) => ({ ...l, selected: true, sno: 1 })),
      ...others.map((l, index) => ({
        ...l,
        selected: false,
        sno: index + 2,
      })),
    ];
  }, [isLanguageChosen, allLanguages, i18n.language]);

  return (
    <ZModal type="languageChangeModal" open={open} width={200}>
      <LanguagesList languages={sortedLanguages} type="modal" />
    </ZModal>
  );
};
