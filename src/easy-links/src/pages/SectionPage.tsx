import { Link, useParams } from "react-router-dom";
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
import { NotificationsBell } from "@/components/NotificationsBell";

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

  const notifyBackend = async (type: string, rowIndex: number, rowData: any) => {
    if (!id) return;

    await fetch("http://10.24.12.252:3001/update-row", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sectionId: id,
        rowIndex,
        type,
        rowData,
      }),
    });
  };

  const sendUpdate = async (rowIndex: number, newRow: LinkRow, type = "update") => {
    if (!id) return;

    const local = [...rows];

    if (type === "add") {
      local.push(newRow);
    } else if (type === "delete") {
      local.splice(rowIndex, 1);
    } else {
      local[rowIndex] = newRow;
    }

    setRows(local);

    if (type === "add") {
      await tableService.insertTableRow(id, newRow);
    } else if (type === "update") {
      const before = rows[rowIndex];
      if (JSON.stringify(before) === JSON.stringify(newRow)) { return }
      await tableService.updateTableRow(id, rowIndex, newRow);
    } else if (type === "delete") {
      await tableService.removeTableRow(id, rowIndex);
    }

    notifyBackend(type, rowIndex, newRow);
  };

  return (
    <div className="p-8">

      {copiedLink && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full">
          <Alert className="flex items-center gap-2 bg-gray-800 text-white p-4 rounded-md">
            <CheckCircle2Icon className="w-5 h-5 text-green-500" />
            <div>
              <AlertTitle>Link copiado!</AlertTitle>
              <AlertDescription>{copiedLink}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {alert && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full">
          <Alert className="flex items-center gap-2 bg-gray-800 text-white p-4 rounded-md">
            <CheckCircle2Icon className="w-5 h-5 text-white" />
            <div>
              <AlertTitle>Atualização na tabela!</AlertTitle>
              <AlertDescription>
                {alert.type.toUpperCase()} — Na linha {alert.newRowData?.name ?? "-"}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      <LinkSection
        title={
          <div className="flex items-center justify-between">
            <span>{sectionInfo?.title}</span>
            <NotificationsBell notifications={notifications.filter(n => n.sectionId === id)} />
          </div>
        }
        description={sectionInfo?.description}
      >
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
                  onChange={(v) => sendUpdate(index, { ...row, name: v }, "update")}
                />

                <CellDatePicker
                  value={row.date}
                  onChange={(v) => sendUpdate(index, { ...row, date: v }, "update")}
                />

                <CellLink
                  href={row.link}
                  onChange={(v) => sendUpdate(index, { ...row, link: v }, "update")}
                />

                <CellTag>{row.tag}</CellTag>

                <CellActions
                  onDelete={() => sendUpdate(index, row, "delete")}
                  onCopy={async () => {
                    await navigator.clipboard.writeText(row.link);
                    setCopiedLink(row.link);
                  }}
                />
              </TableRow>
            ))}

            {isAdding ? (
              <AddRow
                onAdd={(r) => {
                  sendUpdate(rows.length, r, "add");
                  setIsAdding(false);
                }}
              />
            ) : (
              <NewElement onClick={() => setIsAdding(true)} />
            )}
          </TableBody>

        </Table>
      </LinkSection>
      <div className="mt-8 max-w-5xl mx-auto">
      <Link
        to="/"
        className="px-4 py-2 bg-gray-700 text-white rounded-md shadow hover:bg-gray-900 transition"
      >
        Voltar
      </Link>
    </div>
    </div>
  );
}
