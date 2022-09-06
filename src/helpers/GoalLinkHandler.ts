/* eslint-disable no-useless-escape */
interface goalLinkHandlerResponse {
    status: boolean,
    value: { index:number, value: null | string } | null
}

export const goalLinkHandler = (input:string) => {
  const res : goalLinkHandlerResponse = { status: false, value: null };

  if (!input) { return res; }
  const detector = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])|(www)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/i;
  const linkIndex = input.search(detector);
  if (linkIndex !== -1) {
    const link = input.slice(linkIndex).split(" ")[0];
    res.status = true;
    res.value = { index: linkIndex, value: link };
  } else res.value = null;

  return res;
};
