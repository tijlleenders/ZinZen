import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { atom } from "recoil";

export const newGroupTitle = atom({
  key: "newGroupTitle",
  default: ""
});

export const displayExploreGroups = atom({
  key: "displayExploreGroups",
  default: false as boolean
});

export const displayGroup = atom({
  key: "displayGroup",
  default: null as PublicGroupItem | null
});

export const displayAddPublicGroup = atom({
  key: "displayAddPublicGroup",
  default: false
});
