import { useState } from "react"
import { LinkSection } from '@/components/Section/section'
import { Table, TableHeader, TableRow, TableHead, TableBody, 
  CellTag, CellLink, CellDatePicker, CellActions, CellName } from '@/components/ui/table'
import { AddRow } from "@/components/AddRow/AddRow"
import { NewElement } from "@/components/AddRow/NewElementButton"

export default function App() {
  type Row = {
  name: string
  date: string
  link: string
  tag: string
  } 

  const [rows, setRows] = useState<Row[]>([])

  const handleDelete = (indexToRemove: number) => {
  const updatedRows = rows.filter((_, currentIndex) => currentIndex !== indexToRemove)
  setRows(updatedRows)
  }

  const [isAdding, setIsAdding] = useState(false)

  return (
    <LinkSection title="Links Acadêmicos" 
      description="Lista de recursos úteis para ambiente acadêmico">

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
              const updated = [...rows]
              updated[index].name = newValue
              setRows(updated)
            }}
          />

          <CellDatePicker value={row.date} />
          <CellLink href={row.link}
            onChange={(newLink) => {
            const updated = [...rows]
            updated[index].link = newLink
            setRows(updated)
            }} 
          />
          <CellTag>{row.tag}</CellTag>
          <CellActions
            onView={() => console.log("Visualizar", row)}
            onDelete={() => handleDelete(index)}
          />
          </TableRow>
      ))}

        {isAdding ? (
  <AddRow
    onAdd={(row) => {
      setRows([...rows, row])
      setIsAdding(false) // volta para NewElement após adicionar
    }}
  />
) : (
  <NewElement onClick={() => setIsAdding(true)} />
)}
        </TableBody>
      </Table>
    </LinkSection>
  )
}
