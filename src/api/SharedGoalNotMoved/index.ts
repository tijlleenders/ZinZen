import { db } from "@models";
import { SharedGoalMetadata } from "@src/models/SharedGoalNotMoved";

// Get shared goal metadata by goal ID
export const getSharedGoalMetadataByGoalId = async (goalId: string): Promise<SharedGoalMetadata | null> => {
  try {
    const entries = await db.sharedGoalMetadataCollection.where("goalId").equals(goalId).toArray();
    return entries.length > 0 ? entries[0] : null;
  } catch (error) {
    console.error("Error getting shared goal metadata by goal ID:", error);
    throw new Error("Failed to get shared goal metadata by goal ID.");
  }
};

// Create a new shared goal metadata entry
export const createSharedGoalMetadata = async (
  goalId: string,
  parentGoalId: string,
  sharedAncestorId: string,
): Promise<SharedGoalMetadata | null> => {
  // Check if entry already exists
  const existingEntry = await getSharedGoalMetadataByGoalId(goalId);
  if (existingEntry) {
    return null; // Return existing entry if found
  }

  const newEntry: SharedGoalMetadata = {
    goalId,
    parentGoalId,
    sharedAncestorId,
  };

  await db.sharedGoalMetadataCollection.add(newEntry);
  return newEntry;
};

// Get all shared goal metadata entries
export const getAllSharedGoalMetadata = async (): Promise<SharedGoalMetadata[]> => {
  try {
    return await db.sharedGoalMetadataCollection.toArray();
  } catch (error) {
    console.error("Error getting shared goal metadata:", error);
    throw new Error("Failed to get shared goal metadata.");
  }
};

// Get shared goal metadata by parent goal ID
export const getSharedGoalMetadataByParentGoalId = async (parentGoalId: string): Promise<SharedGoalMetadata[]> => {
  try {
    return await db.sharedGoalMetadataCollection.where("parentGoalId").equals(parentGoalId).toArray();
  } catch (error) {
    console.error("Error getting shared goal metadata by parent goal ID:", error);
    throw new Error("Failed to get shared goal metadata by parent goal ID.");
  }
};

// Delete a shared goal metadata entry by goal ID
export const deleteSharedGoalMetadata = async (goalId: string): Promise<boolean> => {
  try {
    const entry = await getSharedGoalMetadataByGoalId(goalId);
    if (entry) {
      await db.sharedGoalMetadataCollection.delete(goalId);
    }
    return true;
  } catch (error) {
    console.error("Error deleting shared goal metadata:", error);
    throw new Error("Failed to delete shared goal metadata.");
  }
};

// Delete all shared goal metadata for a specific parent goal
export const deleteSharedGoalMetadataByParentGoalId = async (parentGoalId: string): Promise<boolean> => {
  try {
    const entries = await getSharedGoalMetadataByParentGoalId(parentGoalId);
    await Promise.all(entries.map((entry) => db.sharedGoalMetadataCollection.delete(entry.goalId)));
    return true;
  } catch (error) {
    console.error("Error deleting shared goal metadata by parent goal ID:", error);
    throw new Error("Failed to delete shared goal metadata by parent goal ID.");
  }
};
