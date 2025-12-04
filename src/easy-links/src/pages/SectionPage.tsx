import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { LinkSection } from "@/components/Section/section";
import {
  Table, TableHeader, TableRow, TableHead, TableBody,
  CellTag, CellLink, CellDatePicker, CellActions, CellName
} from "@/components/ui/table";
import { AddRow } from "@/components/AddRow/AddRow";
import { NewElement } from "@/components/AddRow/NewElementButton";
import { localStorage as storage } from "@/services/LocalStorageService";
import type { LinkRow } from "@/services/LocalStorageService";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export default function SectionPage() {
  const { id } = useParams();
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [sectionInfo, setSectionInfo] = useState<{title:string, description:string}|null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    setRows(storage.list());
    const data = localStorage.getItem(`section-${id}`);
    if (data) setSectionInfo(JSON.parse(data));
  }, [id]);

  useEffect(() => {
    if (!copiedLink) return;
    const timer = setTimeout(() => setCopiedLink(null), 2000);
    return () => clearTimeout(timer);
  }, [copiedLink]);

  if (!sectionInfo) return <p>Seção não encontrada</p>;

  return (
    <>
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
                  onChange={(newValue) => {
                    storage.update(index, { name: newValue });
                    setRows(storage.list());
                  }}
                />
                <CellDatePicker
                  value={row.date}
                  onChange={(newDate) => {
                    storage.update(index, { date: newDate });
                    setRows(storage.list());
                  }}
                />
                <CellLink
                  href={row.link}
                  onChange={(newLink) => {
                    storage.update(index, { link: newLink });
                    setRows(storage.list());
                  }}
                />
                <CellTag>{row.tag}</CellTag>
                <CellActions
                  onDelete={() => {
                    storage.remove(index);
                    setRows(storage.list());
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
                onAdd={(row) => {
                  storage.insert(row);
                  setRows(storage.list());
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
