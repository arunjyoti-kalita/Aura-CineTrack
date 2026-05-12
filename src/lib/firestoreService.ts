import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db } from "./firebase";
import { Entry, Goal, CustomList } from "../types";

export interface UserData {
  entries: Entry[];
  goals: Goal[];
  lists: CustomList[];
  challenge: string | null;
  preferences: { mood: string; volume: number };
  dailyPick: { id: string; date: string } | null;
}

export const saveUserDataToCloud = async (userId: string, type: string, data: any) => {
  const userRef = doc(db, "users", userId);
  try {
    await setDoc(userRef, { [type]: data }, { merge: true });
  } catch (error) {
    console.error(`Error saving ${type} to cloud:`, error);
    throw error;
  }
};

export const loadUserDataFromCloud = async (userId: string): Promise<Partial<UserData> | null> => {
  const userRef = doc(db, "users", userId);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserData;
    }
    return null;
  } catch (error: any) {
    console.error("Error loading data from cloud:", error);
    throw error;
  }
};

export const syncAllDataToCloud = async (userId: string, data: UserData) => {
  const userRef = doc(db, "users", userId);
  try {
    await setDoc(userRef, data);
  } catch (error) {
    console.error("Error syncing all data to cloud:", error);
    throw error;
  }
};
