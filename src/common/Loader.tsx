import React, { useEffect, useState } from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = () => {
  const [mobile, setMobile] = useState(false);

  window.matchMedia("(max-width: 600px)").onchange = () => setMobile(window.matchMedia("(max-width: 600px)").matches);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 600px)").matches);
  }, []);

  return (
    <Spinner
      style={{
        position: "absolute",
        top: "18px",
        left: mobile ? "18px" : 0,
        width: "50px",
        height: "50px",
        color: "#CD6E51"
      }}
      animation="border"
      role="status"
    >

      <span className="visually-hidden">Loading...</span>
    </Spinner>

  );
};

export default Loader;
