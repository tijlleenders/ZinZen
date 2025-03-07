// @ts-nocheck
// draft test - will be rewritten

import { db } from "@models";
import { TrashItem } from "@src/models/TrashItem";
import { cleanupTrash } from "../../api/TrashAPI/index";

jest.mock("@models", () => ({
  db: {
    goalTrashCollection: {
      toArray: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("TrashAPI - testing cleanup functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should delete items older than 7 days", async () => {
    const now = new Date();
    const eightDaysAgo = new Date(now);
    eightDaysAgo.setDate(now.getDate() - 8);
    const sixDaysAgo = new Date(now);
    sixDaysAgo.setDate(now.getDate() - 6);

    const mockTrashItems: Pick<TrashItem, "id" | "deletedAt">[] = [
      {
        id: "1",
        deletedAt: eightDaysAgo.toISOString(), // should be deleted
      },
      {
        id: "2",
        deletedAt: sixDaysAgo.toISOString(), // should be kept
      },
    ];

    (db.goalTrashCollection.toArray as jest.Mock).mockResolvedValue(mockTrashItems);
    (db.goalTrashCollection.delete as jest.Mock).mockResolvedValue(undefined);

    await cleanupTrash();

    expect(db.goalTrashCollection.delete).toHaveBeenCalledTimes(1);
    expect(db.goalTrashCollection.delete).toHaveBeenCalledWith("1");
    expect(db.goalTrashCollection.delete).not.toHaveBeenCalledWith("2");
  });

  it("should handle empty trash collection", async () => {
    (db.goalTrashCollection.toArray as jest.Mock).mockResolvedValue([]);

    await cleanupTrash();

    expect(db.goalTrashCollection.delete).not.toHaveBeenCalled();
  });

  it("should delete multiple old items", async () => {
    const now = new Date();
    const tenDaysAgo = new Date(now);
    tenDaysAgo.setDate(now.getDate() - 10);
    const nineDaysAgo = new Date(now);
    nineDaysAgo.setDate(now.getDate() - 9);
    const threeDaysAgo = new Date(now);
    threeDaysAgo.setDate(now.getDate() - 3);

    const mockTrashItems: Pick<TrashItem, "id" | "deletedAt">[] = [
      {
        id: "1",
        deletedAt: tenDaysAgo.toISOString(),
      },
      {
        id: "2",
        deletedAt: nineDaysAgo.toISOString(),
      },
      {
        id: "3",
        deletedAt: threeDaysAgo.toISOString(),
      },
    ];

    (db.goalTrashCollection.toArray as jest.Mock).mockResolvedValue(mockTrashItems);
    await cleanupTrash();

    expect(db.goalTrashCollection.delete).toHaveBeenCalledTimes(2);
    expect(db.goalTrashCollection.delete).toHaveBeenCalledWith("1");
    expect(db.goalTrashCollection.delete).toHaveBeenCalledWith("2");
    expect(db.goalTrashCollection.delete).not.toHaveBeenCalledWith("3");
  });

  it("should handle items exactly 7 days old", async () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);

    const mockTrashItems: Pick<TrashItem, "id" | "deletedAt">[] = [
      {
        id: "1",
        deletedAt: sevenDaysAgo.toISOString(),
      },
    ];

    (db.goalTrashCollection.toArray as jest.Mock).mockResolvedValue(mockTrashItems);
    await cleanupTrash();

    expect(db.goalTrashCollection.delete).not.toHaveBeenCalled();
  });

  it("should handle invalid dates in trash items", async () => {
    const mockTrashItems: Pick<TrashItem, "id" | "deletedAt">[] = [
      {
        id: "1",
        deletedAt: "invalid-date",
      },
      {
        id: "2",
        deletedAt: new Date().toISOString(),
      },
    ];

    (db.goalTrashCollection.toArray as jest.Mock).mockResolvedValue(mockTrashItems);

    await expect(cleanupTrash()).resolves.not.toThrow();
    expect(db.goalTrashCollection.delete).not.toHaveBeenCalled();
  });
});
