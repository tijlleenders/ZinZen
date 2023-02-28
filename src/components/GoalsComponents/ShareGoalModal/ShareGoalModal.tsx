import { Modal } from "react-bootstrap";
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import addDark from "@assets/images/addDark.svg";
import addLight from "@assets/images/addLight.svg";
import shareAnonymous from "@assets/images/shareAnonymous.svg";
import shareWithFriend from "@assets/images/shareWithFriend.svg";
import myGroupsIconFilledLight from "@assets/images/myGroupsIconFilledLight.svg";
import myGroupsIconFilledDark from "@assets/images/myGroupsIconFilledDark.svg";

import Loader from "@src/common/Loader";
import { addSubInPub } from "@src/api/PubSubAPI";
import ContactItem from "@src/models/ContactItem";
import ConfirmationModal from "@src/common/ConfirmationModal";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { getAllPublicGroups } from "@src/api/PublicGroupsAPI";
import { confirmAction, IShareGoalModalProps } from "@src/Interfaces/IPopupModals";
import { convertIntoSharedGoal } from "@src/helpers/GoalProcessor";
import { shareGoalWithContact } from "@src/services/contact.service";
import { darkModeState, displayToast, showConfirmation } from "@src/store";
import { checkAndUpdateRelationshipStatus, getAllContacts } from "@src/api/ContactsAPI";
import { getGoal, shareMyGoalAnonymously, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import SubMenu, { SubMenuItem } from "./SubMenu";
import AddContactModal from "./AddContactModal";

import "./ShareGoalModal.scss";

const ShareGoalModal : React.FC<IShareGoalModalProps> = ({ goal, showShareModal, setShowShareModal }) => {
  const minContacts = 1;

  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);

  const [loading, setLoading] = useState({ P: false, A: false, S: false });
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [userGroups, setUserGroups] = useState<PublicGroupItem[]>([]);
  const [displaySubmenu, setDisplaySubmenu] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<confirmAction | null>(null);
  const [displayConfirmation, setDisplayConfirmation] = useRecoilState(showConfirmation);

  const handleShowAddContact = () => setShowAddContactModal(true);

  const getContactBtn = (relId = "", name = "", accepted = false) => (
    <div className="contact-button">
      <button
        type="button"
        style={name === "" || accepted ? {} : { background: "#DFDFDF", color: "#979797" }}
        onClick={async (e) => {
          e.stopPropagation();
          setLoading({ ...loading, S: true });
          if (name === "") handleShowAddContact();
          else {
            const status = accepted ? true : await checkAndUpdateRelationshipStatus(relId);
            if (goal.typeOfGoal === "myGoal" && status) {
              await shareGoalWithContact(relId, convertIntoSharedGoal(goal));
              setShowToast({ open: true, message: `Cheers!!, Your goal is shared with ${name}`, extra: "" });
              updateSharedStatusOfGoal(goal.id, relId, name).then(() => console.log("status updated"));
              addSubInPub(goal.id, relId, "shared").then(() => console.log("subscriber added"));
            } else {
              navigator.clipboard.writeText(`${window.location.origin}/invite/${relId}`);
              setShowToast({ open: true, message: "Link copied to clipboard", extra: `Your invite hasn't been accepted yet. Send this link to ${name} so that they can add you in their contacts` });
            }
          }
          setLoading({ ...loading, S: false });
        }}
        className={`${name === "" ? "add-icon" : "contact-icon"}`}
      >
        { name === "" ? <img alt="add contact" width={35} src={darkModeStatus ? addDark : addLight} /> : name[0]}
      </button>
      { name !== "" && <p style={{ margin: 0 }}>{name}</p> }
    </div>
  );

  const handleActionClick = async (action: string) => {
    console.log(action);
    if (action === "shareAnonymously") {
      let parentGoalTitle = "root";
      setLoading({ ...loading, A: true });
      if (goal.parentGoalId !== "root") { parentGoalTitle = (await getGoal(goal.parentGoalId)).title; }
      const { response } = await shareMyGoalAnonymously(goal, parentGoalTitle);
      setShowToast({ open: true, message: response, extra: "" });
      setLoading({ ...loading, A: false });
    } else if (action === "shareWithOne") {
      setDisplaySubmenu("contacts");
      if (contacts.length === 0) { handleShowAddContact(); }
    }
    setConfirmationAction(null);
  };

  const openConfirmationPopUp = async (action: confirmAction) => {
    const { actionCategory, actionName } = action;
    if (actionCategory === "collaboration" && displayConfirmation.collaboration[actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...displayConfirmation, open: true });
    } else if (actionCategory === "goal" && displayConfirmation.goal[action.actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...displayConfirmation, open: true, });
    } else {
      await handleActionClick(actionName);
    }
  };
  useEffect(() => {
    (async () => {
      const userContacts = await getAllContacts();
      const groups = await getAllPublicGroups();
      setUserGroups([...groups]);
      setContacts([...userContacts]);
    })();
  }, [showAddContactModal]);

  return (
    <Modal
      id={`share-modal${darkModeStatus ? "-dark" : ""}`}
      show={showShareModal !== ""}
      onHide={() => setShowShareModal("")}
      centered
      autoFocus={false}
      style={showAddContactModal ? { zIndex: 1 } : {}}
    >
      <Modal.Body id="share-modal-body">
        { confirmationAction && <ConfirmationModal action={confirmationAction} handleClick={handleActionClick} /> }
        <h4>{displaySubmenu === "groups" ? "Share in Public Group" : "Share Goals"}</h4>
        { displaySubmenu === "groups" ? (
          <SubMenu>
            {userGroups.map((grp) => <SubMenuItem key={grp.id} group={grp} goal={goal} />)}
          </SubMenu>
        ) : (
          <>
            {/* Share Anonymously */}
            <button
              onClick={async () => {
                await openConfirmationPopUp({ actionCategory: "goal", actionName: "shareAnonymously" });
              }}
              type="button"
              className="shareOptions-btn"
            >
              <div className="share-Options">
                <div> <img alt="share goal anonymously" src={shareAnonymous} /> </div>
                <p className="shareOption-name">Share Anonymously</p>
                { loading.A && <Loader /> }
              </div>
            </button>

            {/* Share in a public group */}
            <button
              type="button"
              className="shareOptions-btn"
              onClick={() => {
                if (userGroups.length > 0) {
                  setDisplaySubmenu("groups");
                } else {
                  setShowToast({
                    open: true,
                    message: "Sorry, You don't have any groups.",
                    extra: "Create or Join a group on My Groups page" });
                }
              }}
            >
              <div className="share-Options">
                <div> <img
                  alt="share goal public"
                  src={darkModeStatus ? myGroupsIconFilledDark : myGroupsIconFilledLight}
                />
                </div>
                <p className="shareOption-name">Share in Public Group</p>
                { loading.P && <Loader /> }
              </div>
            </button>

            {/* Share 1:1 */}
            <button
              disabled={goal.typeOfGoal !== "myGoal"}
              type="button"
              onClick={async () => { if (displaySubmenu !== "contacts") await openConfirmationPopUp({ actionCategory: "goal", actionName: "shareWithOne" }); }}
              className="shareOptions-btn"
            >
              <div className="share-Options">
                <div> <img alt="share with friend" src={shareWithFriend} /> </div>
                <p className="shareOption-name">
                  Share 1:1 <br />
                  {goal.typeOfGoal === "shared" && ` - Goal is shared with ${goal.shared.contacts[0].name}`}
                  {goal.typeOfGoal === "collaboration" && ` - Goal is in collaboration with ${goal.collaboration.collaborators[0].name}`}
                </p>
                { loading.S && <Loader /> }
              </div>
              { (goal.typeOfGoal === "myGoal") && displaySubmenu === "contacts" && (
              <div className="shareWithContacts">
                {contacts.length === 0 &&
                  <p className="share-warning"> You don&apos;t have a contact yet.<br />Add one! </p>}
                { contacts.length > 0 &&
                  <p className="share-warning"> Don&apos;t Worry. <br /> We will soon allow our users to add more than 1 contact </p>}
                <div id="modal-contact-list" style={contacts.length <= minContacts ? { justifyContent: "flex-start" } : {}}>
                  { contacts.length > 0 &&
                    contacts.slice(0, Math.min(minContacts, contacts.length)).map((ele) => (
                      getContactBtn(ele.relId, ele.name, ele.accepted)
                    ))}
                  { contacts.length === 0 && getContactBtn() }
                </div>
              </div>
              )}
            </button>

          </>
        )}
      </Modal.Body>
      { showAddContactModal && <AddContactModal showAddContactModal={showAddContactModal} setShowAddContactModal={setShowAddContactModal} /> }
    </Modal>
  );
};

export default ShareGoalModal;
