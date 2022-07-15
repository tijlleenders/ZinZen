const goalObject = {
  title: "Attend ZinZen online meeting ://meet.google.com/evb-vozr-ico",
  lang: "en",
  color: "#fff",
};
const newData = (data) => [...data, goalObject];
const detector = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\\/~+#-]*[\w@?^=%&\\/~+#-])/;

function urlDetection() { /*
  if (goalObject.title.search(detector) !== -1) {
    return {
      newData,
      suggestion: { Link: "Link" },
    };
  }

  return {
    newData,
  }; */
}
describe("getUrl function", () => {
  it("should return link : Link", () => {
    function time() {
      if (goalObject.title.search(detector) !== -1) {
        return {
          newData,
          suggestion: { Link: "Link" },
        };
      }

      return {
        newData,
      };
    }
    expect(urlDetection()).toEqual(time());
  });
});
