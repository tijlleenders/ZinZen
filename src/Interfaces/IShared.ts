export interface IShared {
  conversionRequests: { status: boolean; senders: string[] };
  contacts: { relId: string; name: string }[];
  allowed: boolean;
}
