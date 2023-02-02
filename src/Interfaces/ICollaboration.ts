export interface ICollaboration {
    newUpdates: boolean,
    collaborators: {relId: string, name: string}[],
    allowed: boolean
  }
