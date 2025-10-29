import { useState, useEffect } from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

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
        <input
          type="text"
          value={newRow.name}
          onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
          className="border rounded px-2 py-1 text-sm w-full"
          placeholder="Nome"
        />
      </TableCell>
      <TableCell>
        <input
          type="date"
          value={newRow.date}
          onChange={(e) => setNewRow({ ...newRow, date: e.target.value })}
          className="border rounded px-2 py-1 text-sm w-full"
        />
      </TableCell>
      <TableCell>
        <input
          type="text"
          value={newRow.link}
          onChange={(e) => setNewRow({ ...newRow, link: e.target.value })}
          className="border rounded px-2 py-1 text-sm w-full"
          placeholder="https://..."
        />
      </TableCell>
      <TableCell>
        <input
          type="text"
          value={newRow.tag}
          onChange={(e) => setNewRow({ ...newRow, tag: e.target.value })}
          className="border rounded px-2 py-1 text-sm w-full"
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
