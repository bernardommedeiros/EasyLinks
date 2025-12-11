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

import type { NotificationMessage } from "@/services/useNotifications";
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

  // Notificações
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

  const updateRows = async (newRows: LinkRow[]) => {
    setRows(newRows);
    if (id) await tableService.setTableRows(id, newRows);
  };

  return (
    <>
      {/* Alert temporário */}
      {copiedLink && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert className="flex items-center gap-2 bg-gray-800 text-white border-none shadow-md p-4 rounded-md">
            <CheckCircle2Icon className="w-5 h-5 text-green-500" />
            <div>
              <AlertTitle className="text-white">Link copiado com sucesso!</AlertTitle>
              <AlertDescription className="text-gray-300">{copiedLink}</AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* Alert de notificação de tabela */}
      {alert && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md">
          <Alert className="flex items-center gap-2 bg-blue-800 text-white border-none shadow-md p-4 rounded-md">
            <CheckCircle2Icon className="w-5 h-5 text-white" />
            <div>
              <AlertTitle>Atualização na tabela!</AlertTitle>
              <AlertDescription>
                {alert.type.toUpperCase()} - linha {alert.rowIndex ?? "-"} da seção {alert.sectionId}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      )}

      {/* Cabeçalho com Bell */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Seções</h1>
        <NotificationsBell notifications={notifications} />
      </div>

      {/* Tabela de dados */}
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
                  onChange={async (newValue) => {
                    const updatedRows = [...rows];
                    updatedRows[index].name = newValue;
                    await updateRows(updatedRows);
                  }}
                />
                <CellDatePicker
                  value={row.date}
                  onChange={async (newDate) => {
                    const updatedRows = [...rows];
                    updatedRows[index].date = newDate;
                    await updateRows(updatedRows);
                  }}
                />
                <CellLink
                  href={row.link}
                  onChange={async (newLink) => {
                    const updatedRows = [...rows];
                    updatedRows[index].link = newLink;
                    await updateRows(updatedRows);
                  }}
                />
                <CellTag>{row.tag}</CellTag>
                <CellActions
                  onDelete={async () => {
                    const updatedRows = [...rows];
                    updatedRows.splice(index, 1);
                    await updateRows(updatedRows);
                  }}
                  onCopy={async () => {
                    try {
                      await navigator.clipboard.writeText(row.link);
                      setCopiedLink(row.link);
                    } catch (err) {
                      console.error("Falha ao copiar o link:", err);
                    }
                  }}
                />
              </TableRow>
            ))}
            {isAdding ? (
              <AddRow
                onAdd={async (row) => {
                  const updatedRows = [...rows, row];
                  await updateRows(updatedRows);
                  setIsAdding(false);
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
