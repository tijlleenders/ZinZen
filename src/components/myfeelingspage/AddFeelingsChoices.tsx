import React from 'react';

import { feelingsList, feelingsCategories } from '@consts/FeelingsList';
import { FeelingTemplate } from './FeelingTemplate';

export function AddFeelingsChoices() {
  return (
    <div>
      {feelingsCategories.map((feelingCategory : string) => (
        <FeelingTemplate
          key={feelingCategory}
          feelingCategory={feelingCategory}
          feelingsList={feelingsList[feelingCategory]}
        />
      ))}
    </div>
  );
}
