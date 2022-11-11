import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { acceptRelationship } from "@src/api/ContactsAPI";
import { queryStyle } from "@src/constants/booleanScreen";
import { t } from "i18next";
import React from "react";
import { useNavigate } from "react-router";

const InvitePage = () => {
  const navigate = useNavigate();
  return (
    <div id="query-container">
      <MainHeaderDashboard />
      <div style={{ ...queryStyle.main }}>
        <p style={{ paddingTop: "100px", margin: 0 }}>
          You have been invited to colaborate
          <br />
          Would you like to accept the invite?
        </p>
        <button
          type="button"
          style={queryStyle.question}
          onClick={acceptRelationship}
        > Yes
        </button>
        <button
          type="button"
          style={queryStyle.question}
          onClick={() => { navigate("/"); }}
        > No
        </button>
      </div>
    </div>
  );
};

export default InvitePage;
