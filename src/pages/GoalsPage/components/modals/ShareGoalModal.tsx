import React, { useState, useEffect, CSSProperties, ReactNode } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";

import GlobalAddIcon from "@assets/images/globalAdd.svg";

import ContactItem from "@src/models/ContactItem";
import ConfirmationModal from "@src/common/ConfirmationModal";
import ZModal from "@src/common/ZModal";
import { GoalItem } from "@src/models/GoalItem";
import { TConfirmAction } from "@src/Interfaces/IPopupModals";
import { darkModeState, displayConfirmation } from "@src/store";
import { checkAndUpdateRelationshipStatus, getAllContacts } from "@src/api/ContactsAPI";
import useGoalActions from "@src/hooks/useGoalActions";

import Icon from "../../../../common/Icon";
import AddContactModal from "./AddContactModal";
import "./ShareGoalModal.scss";

const ContactBtn = ({
  name,
  children,
  style,
  onClick,
}: {
  onClick: () => Promise<void> | void;
  name?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) => (
  <div className="contact-icon d-flex f-col gap-4">
    <button
      type="button"
      style={style || {}}
      onClick={async (e) => {
        e.stopPropagation();
        await onClick();
      }}
    >
      {name ? name[0] : children}
    </button>
    {name && <p style={{ margin: 0 }}>{name}</p>}
  </div>
);

const ShareGoalModal = ({ goal }: { goal: GoalItem }) => {
  const minContacts = 10;
  const navigate = useNavigate();
  const { addContact, shareGoalWithRelId } = useGoalActions();
  const { state, pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const darkModeStatus = useRecoilValue(darkModeState);

  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [displaySubmenu, setDisplaySubmenu] = useState("contacts");
  const [showConfirmation, setDisplayConfirmation] = useRecoilState(displayConfirmation);
  const [confirmationAction, setConfirmationAction] = useState<TConfirmAction | null>(null);
  const showAddContactModal = searchParams.get("addContact") === "true";

  const handleShowAddContact = () => {
    navigate(`${pathname}?share=true&addContact=true`, { state });
  };

  const handleActionClick = async (action: string) => {
    if (action === "shareWithOne") {
      setDisplaySubmenu("contacts");
      if (contacts.length === 0) {
        handleShowAddContact();
      }
    }
    setConfirmationAction(null);
  };

  const openConfirmationPopUp = async (action: TConfirmAction) => {
    const { actionCategory, actionName } = action;
    if (actionCategory === "collaboration" && showConfirmation.collaboration[actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...showConfirmation, open: true });
    } else if (actionCategory === "goal" && showConfirmation.goal[action.actionName]) {
      setConfirmationAction({ ...action });
      setDisplayConfirmation({ ...showConfirmation, open: true });
    } else {
      await handleActionClick(actionName);
    }
  };
  useEffect(() => {
    (async () => {
      const userContacts = await getAllContacts();
      setContacts([...userContacts]);
    })();
  }, [showAddContactModal]);

  return (
    <ZModal open style={showAddContactModal ? { zIndex: 1 } : {}} type={`share-modal${darkModeStatus ? "-dark" : ""}`}>
      {confirmationAction && (
        <ConfirmationModal
          handleClose={() => {
            setConfirmationAction(null);
          }}
          action={confirmationAction}
          handleClick={handleActionClick}
        />
      )}
      <div className="popupModal-title place-middle justify-fs gap-8">
        <div className="icon place-middle">
          <Icon active title="TwoAvatars" />
        </div>

        <p>{displaySubmenu === "groups" ? "Share in Public Group" : "Share privately"}</p>
      </div>
      <div className="d-flex f-col gap-8">
        <button
          type="button"
          onClick={async () => {
            if (displaySubmenu !== "contacts")
              await openConfirmationPopUp({ actionCategory: "goal", actionName: "shareWithOne" });
          }}
          className="shareOptions-btn"
        >
          {displaySubmenu === "contacts" && (
            <div style={{ textAlign: "left" }}>
              {contacts.length === 0 && (
                <p className="share-warning fw-500">
                  You don&apos;t have a contact yet.
                  <br />
                  Add one!
                </p>
              )}
              <div
                id="modal-contact-list"
                className={`d-flex gap-20 justify-${contacts.length <= minContacts ? "fs" : "sa"}`}
              >
                {contacts.length > 0 &&
                  contacts.slice(0, Math.min(minContacts, contacts.length)).map(({ relId, name, accepted }) => (
                    <ContactBtn
                      key={name}
                      name={name}
                      style={accepted ? {} : { background: "#DFDFDF", color: "#979797" }}
                      onClick={async () => {
                        const isRequestAccepted = accepted || (await checkAndUpdateRelationshipStatus(relId));
                        if (!isRequestAccepted) {
                          addContact(relId, goal.id);
                        } else {
                          shareGoalWithRelId(relId, name, goal);
                        }
                      }}
                    />
                  ))}
                {contacts.length < minContacts && (
                  <ContactBtn onClick={handleShowAddContact}>
                    <img alt="add contact" className="global-addBtn-img" width={25} src={GlobalAddIcon} />
                  </ContactBtn>
                )}
              </div>
            </div>
          )}
        </button>
      </div>
      {showAddContactModal && <AddContactModal showAddContactModal={showAddContactModal} />}
    </ZModal>
  );
};

export default ShareGoalModal;
