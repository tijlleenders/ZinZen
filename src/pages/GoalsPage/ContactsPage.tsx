import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Contacts from "@src/helpers/Contacts";
import AppLayout from "@src/layouts/AppLayout";
import { PageTitle } from "@src/constants/pageTitle";
import { useGetAllContacts } from "@src/hooks/api/Contacts/useGetAllContacts";
import { displayToast } from "@src/store";
import { useSetRecoilState } from "recoil";
import ContactActionModal from "./components/modals/ContactActionModal";
import EditContactModal from "./components/modals/EditContactModal";

const ContactsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const showOptions = searchParams.get("showOptions") === "true";
  const showEditModal = searchParams.get("mode") === "edit";
  const { contacts, isError, isLoading } = useGetAllContacts();
  const setShowToast = useSetRecoilState(displayToast);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isError) {
      navigate("/goals");
      return;
    }

    if (!contacts || contacts.length === 0) {
      setShowToast({
        open: true,
        message: "No contacts remaining",
        extra: "Redirected to goals page",
      });
      navigate("/goals");
    }
  }, [isError, contacts, navigate]);

  return (
    <AppLayout title={PageTitle.Contacts}>
      {showOptions && <ContactActionModal />}
      {showEditModal && <EditContactModal />}
      <div className="myGoals-container">
        <div className="my-goals-content">
          <div className="d-flex f-col">
            {contacts?.map((contact) => <Contacts key={contact.id} contact={contact} />)}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ContactsPage;
