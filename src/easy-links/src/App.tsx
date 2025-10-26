import { LinkSection } from '@/components/Section/section'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, 
  TableCellTag, TableCellLink, TableCellDatePicker, TableCellActions } from '@/components/ui/table'

export default function App() {
  return (
    <LinkSection title="Links Acadêmicos" description="Lista de recursos úteis para ambiente acadêmico">
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
          <TableRow>
            <TableCell>Interfaces Ricas</TableCell>
            <TableCellDatePicker value="2025-10-26" />
            <TableCellLink href="https://github.com/persapiens-classes/typescript-example" />
            <TableCellTag>Aulas RIA</TableCellTag>
            <TableCellActions
              onView={() => console.log("Visualizar")}
              onDelete={() => console.log("Excluir")}
            />
          </TableRow>
          <TableRow>
            <TableCell>SUAP IFRN</TableCell>
            <TableCellDatePicker value="2025-10-26" />
            <TableCellLink href="https://suap.ifrn.edu.br/" />
            <TableCellTag>Boletins</TableCellTag>
            <TableCellActions
              onView={() => console.log("Visualizar")}
              onDelete={() => console.log("Excluir")}
            />
          </TableRow>
        </TableBody>
      </Table>
    </LinkSection>
  )
}
