import React from 'react';

import { feelingsList, feelingsCategories } from '@src/constants/FeelingsList';
import { FeelingTemplate } from './AddFeelingTemplate';

export const AddFeelingsChoices = () => (
  <div className="slide">
    {feelingsCategories.map((feelingCategory : string) => (
      <FeelingTemplate
        key={feelingCategory}
        feelingCategory={feelingCategory}
        feelingsList={feelingsList[feelingCategory]}
      />
    ))}
  </div>
);
