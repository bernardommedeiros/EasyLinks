import { TableRow, TableCell } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";


type NewElementProps = {
  onClick: () => void;
};

export function NewElement({ onClick }: NewElementProps) {
  return (
    <TableRow>
      <TableCell>
        <Button
          onClick={onClick}
          className="hover:text-blue-700 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Criar Elemento
        </Button>
      </TableCell>
    </TableRow>
  );
}
