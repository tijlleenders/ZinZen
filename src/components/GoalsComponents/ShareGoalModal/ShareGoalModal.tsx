import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";

import shareAnonymous from "@assets/images/shareAnonymous.svg";
import sharePublic from "@assets/images/sharePublic.svg";
import shareWithFriend from "@assets/images/shareWithFriend.svg";
import addLight from "@assets/images/addLight.svg";
import addDark from "@assets/images/addDark.svg";

import ContactItem from "@src/models/ContactItem";
import { addContact, checkAndUpdateRelationshipStatus, getAllContacts } from "@src/api/ContactsAPI";
import { darkModeState, displayToast } from "@src/store";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { getGoal, shareMyGoalAnonymously, updateSharedStatusOfGoal } from "@src/api/GoalsAPI";
import { initRelationship, shareGoalWithContact } from "@src/services/contact.service";
import { addSubInPub } from "@src/api/PubSubAPI";
import { convertIntoSharedGoal } from "@src/helpers/GoalProcessor";
import Loader from "@src/common/Loader";

import "./ShareGoalModal.scss";
import { getAllPublicGroups } from "@src/api/PublicGroupsAPI";
import { PublicGroupItem } from "@src/models/PublicGroupItem";

import SubMenu, { SubMenuItem } from "./SubMenu";

interface IShareGoalModalProps {
  goal: GoalItem
  showShareModal: string,
  setShowShareModal: React.Dispatch<React.SetStateAction<string>>
}

const shareInvitation = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAACXBIWXMAAAsTAAALEwEAmpwYAAAA30lEQVR4nOXUvUoDQRTF8d9WEay20EKbNH5EfKBY2FrrY/gAEXwFG+0FU9ha2oakiWin+ADKwBWmWNlZXUH0wIHhnnv/MMwH5VrHmp61gwc8Yb9v6Fu4F/gIj1jgPryIWsq+rDPMMcR1eBi1yXfAK1iN9QdY1FLWWZs4xBEGDeBBZKlnoxS6h5fssOoGcJ3lz9gtAZ/iFVsBqBrAVWTb0ZtmWnWOWUM9B+eaxcw/Al/h8ifAdXZDegV/pj8MnmDZAbws/ZAO4qne4KLF0+gdl4ArnOAWdy1OPccddveL9Q7lolSRwSaqJAAAAABJRU5ErkJggg==";

const ShareGoalModal : React.FC<IShareGoalModalProps> = ({ goal, showShareModal, setShowShareModal }) => {
  const minContacts = 1;

  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [loading, setLoading] = useState({ P: false, A: false, S: false });
  const [userGroups, setUserGroups] = useState<PublicGroupItem[]>([]);
  const [newContact, setNewContact] = useState<{ contactName: string, relId: string } | null>(null);
  const [displaySubmenu, setDisplaySubmenu] = useState("");
  const [showAddContactModal, setShowAddContactModal] = useState(false);

  const handleCloseAddContact = () => setShowAddContactModal(false);
  const handleShowAddContact = () => setShowAddContactModal(true);

  const getContactBtn = (relId = "", name = "", accepted = false) => (
    <div className="contact-button">
      <button
        type="button"
        style={name === "" || accepted ? {} : { background: "#DFDFDF", color: "#979797" }}
        onClick={async () => {
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

  const shareThisLink = (link: string) => {
    navigator.share({ text: link }).then(() => {
      setNewContact(null);
      handleCloseAddContact();
    });
  };
  const addNewContact = async () => {
    if (newContact && newContact.relId === "") {
      const res = await initRelationship();
      if (res.success) {
        await addContact(newContact?.contactName, res.response?.relId);
        setNewContact({ ...newContact, relId: res.response?.relId });
        shareThisLink(`${window.location.origin}/invite/${newContact?.relId}`);
      }
    } else {
      shareThisLink(`${window.location.origin}/invite/${newContact?.relId}`);
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
                let parentGoalTitle = "root";
                setLoading({ ...loading, A: true });
                if (goal.parentGoalId !== "root") { parentGoalTitle = (await getGoal(goal.parentGoalId)).title; }
                const { response } = await shareMyGoalAnonymously(goal, parentGoalTitle);
                setShowToast({ open: true, message: response, extra: "" });
                setLoading({ ...loading, A: false });
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
                <div> <img alt="share goal public" src={sharePublic} /> </div>
                <p className="shareOption-name">Share in Public Group</p>
                { loading.P && <Loader /> }
              </div>
            </button>

            {/* Share 1:1 */}
            <button
              disabled={goal.typeOfGoal !== "myGoal"}
              type="button"
              onClick={() => setDisplaySubmenu("contacts")}
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
      <Modal
        className={`addContact-modal popupModal${darkModeStatus ? "-dark" : ""}`}
        show={showAddContactModal}
        onHide={() => {
          setNewContact(null);
          handleCloseAddContact();
        }}
        centered
        autoFocus={false}
      >
        <Modal.Body>
          <p className="popupModal-title"> Add a contact name </p>
          <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
            disabled={newContact ? newContact.relId !== "" : false}
            type="text"
            placeholder="Name"
            className="show-feelings__note-input"
            value={newContact?.contactName || ""}
            onChange={(e) => {
              setNewContact({ contactName: e.target.value, relId: newContact?.relId || "" });
            }}
            onKeyDown={async (e) => {
              if (e.key === "Enter") {
                await addNewContact();
              }
            }}
          />
          <button
            type="button"
            onClick={async () => { await addNewContact(); }}
            className={`addContact-btn${darkModeStatus ? "-dark" : ""}`}
          >
            <img alt="add contact" src={shareInvitation} />Share invitation
          </button>
        </Modal.Body>
      </Modal>
    </Modal>
  );
};

export default ShareGoalModal;
