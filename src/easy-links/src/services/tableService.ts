import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type TableRowData = {
  name: string;
  date: string;
  link: string;
  tag: string;
};

export async function getTableRows(sectionId: string): Promise<TableRowData[]> {
  const docRef = doc(db, "sectionRows", sectionId);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return [];
  const data = snap.data();
  return data.rows || [];
}

export async function setTableRows(sectionId: string, rows: TableRowData[]) {
  const docRef = doc(db, "sectionRows", sectionId);
  await setDoc(docRef, { rows });
}

export async function updateTableRow(
  sectionId: string,
  rowIndex: number,
  newData: Partial<TableRowData>
) {
  const rows = await getTableRows(sectionId);
  if (!rows[rowIndex]) throw new Error("Linha não encontrada");
  rows[rowIndex] = { ...rows[rowIndex], ...newData };
  await setTableRows(sectionId, rows);
}

export async function insertTableRow(sectionId: string, row: TableRowData) {
  const rows = await getTableRows(sectionId);
  rows.push(row);
  await setTableRows(sectionId, rows);
}

export async function removeTableRow(sectionId: string, rowIndex: number) {
  const rows = await getTableRows(sectionId);
  rows.splice(rowIndex, 1);
  await setTableRows(sectionId, rows);
}
