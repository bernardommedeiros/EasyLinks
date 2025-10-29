import { useState, useEffect } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type AddRowProps = {
  onAdd: (row: {
    name: string
    date: string
    link: string
    tag: string
  }) => void
}

export function AddRow({ onAdd }: AddRowProps) {
  const getToday = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const [newRow, setNewRow] = useState({
    name: '',
    date: '',
    link: '',
    tag: '',
  })

  useEffect(() => {
    setNewRow((prev) => ({ ...prev, date: getToday() }))
  }, [])

  const handleAdd = () => {
    if (!newRow.name || !newRow.date || !newRow.link || !newRow.tag) return
    onAdd(newRow)
    setNewRow({ name: '', date: getToday(), link: '', tag: '' })
  }

  return (
    <TableRow>
      <TableCell>
        <Input
          type="text"
          value={newRow.name}
          onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
          placeholder="Nome"
        />
      </TableCell>
      <TableCell>
        <Input
          type="date"
          value={newRow.date}
          onChange={(e) => setNewRow({ ...newRow, date: e.target.value })}
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={newRow.link}
          onChange={(e) => setNewRow({ ...newRow, link: e.target.value })}
          placeholder="https://..."
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={newRow.tag}
          onChange={(e) => setNewRow({ ...newRow, tag: e.target.value })}
          placeholder="Tag"
        />
      </TableCell>
      <TableCell>
        <Button
          className="bg-sky-300 hover:bg-sky-400"
          variant="outline"
          onClick={handleAdd}
        >
          Adicionar
        </Button>
      </TableCell>
    </TableRow>
  )
}
