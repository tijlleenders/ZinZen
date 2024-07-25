import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { usePartnerContext } from "@src/contexts/partner-context";

import BottomNavLayout from "@src/layouts/BottomNavLayout";

const PartnersNavbar = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { partnerId } = useParams();
  const { partner, partnersList } = usePartnerContext();
  return (
    <BottomNavLayout>
      {partnersList.map(({ id, relId, name }) => (
        <button
          key={relId}
          type="button"
          onClick={() => {
            navigate(`/partners/${id}/goals`, {
              state: { ...state, displayPartner: partner },
              replace: true,
            });
          }}
          className={`bottom-nav-item ${partnerId === id ? "active" : ""}`}
        >
          <p>{name}</p>
        </button>
      ))}
    </BottomNavLayout>
  );
};

export default PartnersNavbar;
