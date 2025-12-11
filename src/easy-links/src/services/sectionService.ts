import { db } from "@/firebase";
import {
  collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc,
} from "firebase/firestore";

const COLLECTION = "sections";

export type Section = {
  id: string;
  title: string;
  description?: string;
};

export async function listSections() {
  const snap = await getDocs(collection(db, COLLECTION));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createSection(data: any) {
  return addDoc(collection(db, COLLECTION), data);
}

export async function getSection(id: string): Promise<Section | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;

  const data = snap.data() as Omit<Section, "id">; 
  return { id: snap.id, ...data };
}

export async function updateSection(id: string, data: any) {
  return updateDoc(doc(db, COLLECTION, id), data);
}

export async function removeSection(id: string) {
  return deleteDoc(doc(db, COLLECTION, id));
}
