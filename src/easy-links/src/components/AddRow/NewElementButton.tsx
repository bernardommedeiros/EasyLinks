import { TableRow, TableCell } from "@/components/ui/table"
import { Plus } from "lucide-react"

type NewElementProps = {
  onClick: () => void
}

export function NewElement({ onClick }: NewElementProps) {
    return(
        <TableRow>
            <TableCell>
            <div onClick={onClick}
            className="flex items-center justify-center gap-2 hover:text-blue-600 transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
              <p>Criar Elemento</p>
            </div>
            </TableCell>
        </TableRow>
    )
}