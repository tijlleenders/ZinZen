export const queryStyle = {
  main: {
    display: "flex",
    flexDirection: "column"
  },
  question: {
    alignSelf: "center",
    width: "25vw",
    height: "25vh",
    minWidth: "220px",
    minHeight: "145px",
    maxWidth: "300px",
    maxHeight: "200px",
    color: localStorage.getItem("theme") === "dark" ? "white" : "black",
    background: localStorage.getItem("theme") !== "dark" ? "#EDC7B7" : "rgba(112, 112, 112, 0.4)",
    borderRadius: "10px",
    marginTop: "30px",
    fontWeight: "700",
    border: "none"
  }
};
