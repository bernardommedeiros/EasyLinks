import { useState, useEffect } from "react";
import { LinkSection } from "@/components/Section/section";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  CellTag,
  CellLink,
  CellDatePicker,
  CellActions,
  CellName,
} from "@/components/ui/table";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AddRow } from "@/components/AddRow/AddRow";
import { NewElement } from "@/components/AddRow/NewElementButton";
import { localStorage } from "@/services/LocalStorageService";
import type { LinkRow } from "@/services/LocalStorageService";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function App() {
  const [rows, setRows] = useState<LinkRow[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  useEffect(() => {
    setRows(localStorage.list());
  }, []);

  useEffect(() => {
    if (!copiedLink) return;

    const timer = setTimeout(() => {
      setCopiedLink(null);
    }, 2000);

    return () => clearTimeout(timer); 
  }, [copiedLink]);

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
    <LinkSection
      title="Links Acadêmicos"
      description="Lista de recursos úteis para ambiente acadêmico"
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
                onChange={(newValue) => {
                  localStorage.update(index, { name: newValue });
                  setRows(localStorage.list());
                }}
              />

              <CellDatePicker
              className="w-32"
                value={row.date}
                onChange={(newDate) => {
                  localStorage.update(index, { date: newDate });
                  setRows(localStorage.list());
                }}
              />

              <CellLink
                href={row.link}
                onChange={(newLink) => {
                  localStorage.update(index, { link: newLink });
                  setRows(localStorage.list());
                }}
              />
              <CellTag>{row.tag}</CellTag>
              <CellActions
                onView={async () => {
                  try {
                    await navigator.clipboard.writeText(row.link);
                    setCopiedLink(row.link); 
                  } catch (err) {
                    console.error("Falha ao copiar o link:", err);
                  }
                }}
                onDelete={() => {
                  localStorage.remove(index);
                  setRows(localStorage.list());
                }}
              />
            </TableRow>
          ))}

          {isAdding ? (
            <AddRow
              onAdd={(row) => {
                localStorage.insert(row);
                setRows(localStorage.list());
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
