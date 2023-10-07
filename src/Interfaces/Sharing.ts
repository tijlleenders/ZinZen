export interface ICollaboration {
  newUpdates: boolean;
  collaborators: { relId: string; name: string }[];
}

export interface IShared {
  conversionRequests: { status: boolean; senders: string[] };
  contacts: { relId: string; name: string }[];
}
