import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { LinkSection } from "@/components/Section/section";

import {
  Table, TableHeader, TableRow, TableHead, TableBody,
  CellTag, CellLink, CellDatePicker, CellActions, CellName
} from "@/components/ui/table";

import { AddRow } from "@/components/AddRow/AddRow";
import { NewElement } from "@/components/AddRow/NewElementButton";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

import { getSection } from "@/services/sectionService";
import * as tableService from "@/services/tableService";

import { useNotifications } from "@/services/useNotifications";
import { NotificationsBell } from "@/components/notificationsBell";

export type LinkRow = {
  name: string;
  date: string;
  link: string;
  tag: string;
};

export default function SectionPage() {
  const { id } = useParams<{ id: string }>();
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [sectionInfo, setSectionInfo] = useState<{ title: string; description?: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { notifications, alert } = useNotifications();

  useEffect(() => {
    if (!id) return;

    const loadSection = async () => {
      setLoading(true);

      const section = await getSection(id);
      if (!section) {
        setSectionInfo(null);
        setLoading(false);
        return;
      }
      setSectionInfo(section);

      const firestoreRows = await tableService.getTableRows(id);
      setRows(firestoreRows);

      setLoading(false);
    };

    loadSection();
  }, [id]);

  useEffect(() => {
    if (!copiedLink) return;
    const timer = setTimeout(() => setCopiedLink(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedLink]);

  if (loading) return <p className="text-center mt-8">Carregando...</p>;
  if (!sectionInfo) return <p>Seção não encontrada</p>;

  const sendUpdate = async (rowIndex: number, newRow: LinkRow, type = "edit") => {
    if (!id) return;

    const local = [...rows];
    local[rowIndex] = newRow;
    setRows(local);

    await fetch("http://localhost:3001/update-row", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId: id,
        rowIndex,
        type,
        rowData: newRow,
      }),
    });
  };

  const deleteRow = async (rowIndex: number) => {
    if (!id) return;

    const newRows = rows.filter((_, idx) => idx !== rowIndex);

    setRows(newRows);

    await fetch("http://localhost:3001/update-row", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId: id,
        rowIndex,
        type: "delete",
        rowData: null,
      }),
    });
  };

  return (
    <>
      {copiedLink && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert className="flex items-center gap-2 bg-gray-800 text-white border-none shadow-md p-4 rounded-md">
            <CheckCircle2Icon className="w-5 h-5 text-green-500" />
            <div>
              <AlertTitle className="text-white">Link copiado!</AlertTitle>
              <AlertDescription className="text-gray-300">{copiedLink}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {alert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert className="flex items-center gap-2 bg-blue-800 text-white border-none shadow-md p-4 rounded-md">
            <CheckCircle2Icon className="w-5 h-5 text-white" />
            <div>
              <AlertTitle>Atualização na tabela!</AlertTitle>
              <AlertDescription>
                {alert.type.toUpperCase()} — linha {alert.rowIndex ?? "-"} da seção {alert.sectionId}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Seções</h1>
        <NotificationsBell notifications={notifications} />
      </div>

      <LinkSection title={sectionInfo.title} description={sectionInfo.description}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Tag</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <CellName
                  value={row.name}
                  onChange={(newValue) => sendUpdate(index, { ...row, name: newValue })}
                />
                <CellDatePicker
                  value={row.date}
                  onChange={(newValue) => sendUpdate(index, { ...row, date: newValue })}
                />
                <CellLink
                  href={row.link}
                  onChange={(newValue) => sendUpdate(index, { ...row, link: newValue })}
                />
                <CellTag>{row.tag}</CellTag>

                <CellActions
                  onDelete={() => deleteRow(index)}
                  onCopy={async () => {
                    await navigator.clipboard.writeText(row.link);
                    setCopiedLink(row.link);
                  }}
                />
              </TableRow>
            ))}

            {isAdding ? (
              <AddRow
                onAdd={async (row) => {
                  const idx = rows.length;
                  setRows([...rows, row]);
                  setIsAdding(false);

                  await sendUpdate(idx, row, "add");
                }}
              />
            ) : (
              <NewElement onClick={() => setIsAdding(true)} />
            )}
          </TableBody>
        </Table>
      </LinkSection>
    </>
  );
}
