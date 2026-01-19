import { db } from "@/firebase";
import {
  collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where
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
  const notifQuery = query(
    collection(db, "notifications"),
    where("sectionId", "==", id)
  );

  const notifSnap = await getDocs(notifQuery);

  const notifDeletes = notifSnap.docs.map((d) => deleteDoc(d.ref));

  const rowsCollection = collection(db, `sectionRows/${id}/rows`);
  const rowsSnap = await getDocs(rowsCollection);

  const rowDeletes = rowsSnap.docs.map((d) => deleteDoc(d.ref));

  const deleteSectionRowsDoc = deleteDoc(doc(db, "sectionRows", id));

  const deleteSectionDoc = deleteDoc(doc(db, COLLECTION, id));

  await Promise.all([
    ...notifDeletes,
    ...rowDeletes,
    deleteSectionRowsDoc,
    deleteSectionDoc,
  ]);
}
