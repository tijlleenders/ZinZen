import { useTranslation } from "react-i18next";
import React from "react";
import { PageTitle } from "@src/constants/pageTitle";
import "./HeaderTitle.scss";

interface HeaderTitleProps {
  title: PageTitle;
  onTitleClick?: () => void;
}

const HeaderTitle = ({ title, onTitleClick }: HeaderTitleProps) => {
  const { t } = useTranslation();

  return (
    <h1 className="header-title" onClickCapture={onTitleClick}>
      {t(title)}
    </h1>
  );
};

export default React.memo(HeaderTitle);
