import React from "react";

import { typeOfChange } from "@src/models/InboxItem";

const Header = ({ title, contactName, currentDisplay }: { title: string, contactName: string, currentDisplay: typeOfChange | "none" | "conversionRequest"}) => {
  if (currentDisplay === "conversionRequest") {
    return (
      <> {contactName} is also working on {title}. Do you want to collaborate?</>
    );
  }

  switch (currentDisplay) {
    case "subgoals":
      return <> {contactName} added to {title}.<br /> Add as well ?</>;
    case "modifiedGoals":
      return <> {contactName} made changes in {title}.<br /> Make changes ? </>;
    case "deleted":
      return <> {contactName} deleted {title}. </>;
    case "archived":
      return <> {contactName} completed {title} </>;
    default:
      return <>&nbsp;</>;
  }
};

export default Header;
