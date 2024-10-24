import React from "react";

import { typeOfChange } from "@src/models/InboxItem";

const Header = ({
  title,
  contactName,
  currentDisplay,
}: {
  title: string;
  contactName: string;
  currentDisplay: typeOfChange | "none";
}) => {
  switch (currentDisplay) {
    case "subgoals":
      return (
        <>
          {contactName} added to {title}.&nbsp; &nbsp; Add as well ?
        </>
      );
    case "modifiedGoals":
      return (
        <>
          {contactName} made changes in {title}.&nbsp; &nbsp; Make changes ?
        </>
      );
    case "deleted":
      return (
        <>
          {contactName} deleted {title}.
        </>
      );
    case "archived":
      return (
        <>
          {contactName} completed {title}.
        </>
      );
    case "restored":
      return (
        <>
          {contactName} restored {title}.
        </>
      );
    case "moved":
      return (
        <>
          {contactName} moved {title}.
        </>
      );
    case "newGoalMoved":
      return (
        <>
          {contactName} moved {title} to your goal.
        </>
      );
    default:
      return <>&nbsp;</>;
  }
};

export default Header;
