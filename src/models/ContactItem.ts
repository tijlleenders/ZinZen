export default interface ContactItem {
  id: string;
  name: string;
  relId: string;
  accepted: boolean;
  goalsToBeShared: string[];
  createdAt: Date;
  type: string;
}
