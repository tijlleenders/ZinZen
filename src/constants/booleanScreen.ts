export const
  queryStyle = {
    main: {
      display: "flex",
      flexDirection: "column"
    },
    question: {
      alignSelf: "center",
      width: "calc(100vw - 11px)",
      height: "224px",
      minHeight: "145px",
      maxWidth: "407px",
      maxHeight: "224px",
      background: localStorage.getItem("theme") === "dark" ? "rgba(57, 57, 57, 0.4)" : "rgba(246, 246, 246, 0.4)",
      borderRadius: "10px",
      marginTop: "30px",
      fontSize: "1.286em",
      fontWeight: "700",
      border: "none"
    }
  };
