import React from 'react';
import { atom } from 'recoil';

export const languageSelectionState = atom({
  key: 'keyModalState',
  default: false,
});
