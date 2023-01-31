import React from "react";

import { GoalItem } from "@src/models/GoalItem";
import { typeOfChange } from "@src/models/InboxItem";

const Header = ({ goal, currentDisplay }: {goal: GoalItem, currentDisplay: typeOfChange | "none"}) => {
  const conversionRequests = goal.shared.conversionRequests.status;
  const contactName = conversionRequests ? goal.shared.contacts[0].name : goal.collaboration.collaborators[0].name || "";
  const { title } = goal;
  console.log(goal)
  if (conversionRequests) {
    return (
      <> {contactName} is also working on {goal.title}. Do you want to collaborate?</>
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
