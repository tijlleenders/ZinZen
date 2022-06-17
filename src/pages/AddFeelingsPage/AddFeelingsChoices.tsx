import React from "react";

import { feelingsList, feelingsCategories } from "@consts/FeelingsList";
import { FeelingTemplate } from "./AddFeelingTemplate";

interface AddFeelingsChoicesProps {
  date: Date;
}

export const AddFeelingsChoices: React.FC<AddFeelingsChoicesProps> = ({ date }) => (
  <div>
    {feelingsCategories.map((feelingCategory: string) => (
      <FeelingTemplate
        key={feelingCategory}
        feelingCategory={feelingCategory}
        feelingsList={feelingsList[feelingCategory as keyof typeof feelingsList]}
        feelingDate={date}
      />
    ))}
  </div>
);
