import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { updateSectionStats } from "./statsService";

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

  const before = { ...rows[rowIndex] };
  rows[rowIndex] = { ...rows[rowIndex], ...newData };
  
  await setTableRows(sectionId, rows);
  const hadTag = !!before.tag;
  const hasTag = !!rows[rowIndex].tag;

  if (hadTag !== hasTag) {
    await updateSectionStats(sectionId, {
      totalTags: hasTag ? 1 : -1,
    });
  }
}

export async function insertTableRow(sectionId: string, row: TableRowData) {
  const rows = await getTableRows(sectionId);
  rows.push(row);
  await setTableRows(sectionId, rows);

  await updateSectionStats(sectionId, {
    totalLinks: 1,
    totalTags: row.tag ? 1 : 0,
  });
}

export async function removeTableRow(sectionId: string, rowIndex: number) {
  const rows = await getTableRows(sectionId);
  const [removed] = rows.splice(rowIndex, 1);
  await setTableRows(sectionId, rows);

  if (removed) {
    await updateSectionStats(sectionId, {
      totalLinks: -1,
      totalTags: removed.tag ? -1 : 0,
    });
  }
}
