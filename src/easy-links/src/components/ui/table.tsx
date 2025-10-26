import * as React from "react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Edit, Eye, Trash2 } from "lucide-react"

function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<"tfoot">) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "bg-muted/50 border-t font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        "h-12 hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "text-foreground h-10 px-8 py-2 text-center align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-2 align-middle text-center whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      )}
      {...props}
    />
  )
}

type TableCellTagProps = {
  children: React.ReactNode
  className?: string
}

function TableCellTag({ children, className }: TableCellTagProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-2 align-middle whitespace-nowrap text-center",
        className
      )}
    >
      <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded text-center">
        {children}
      </span>
    </td>
  )
}

type TableCellLinkProps = {
  href: string
  maxLength?: number
  className?: string
}

function TableCellLink({ href, maxLength = 30, className }: TableCellLinkProps) {
  const getDisplayUrl = (url: string) => {
    try {
      const parsed = new URL(url)
      const hostname = parsed.hostname.replace(/^www\./, "")
      const path = parsed.pathname.replace(/\/$/, "")
      return `${hostname}${path}`
    } catch {
      return url
    }
  }

  const fullText = getDisplayUrl(href)
  const shouldTruncate = fullText.length > maxLength
  const displayText = shouldTruncate
    ? fullText.slice(0, maxLength) + "..."
    : fullText

  return (
    <td
      data-slot="table-cell"
      className={cn("px-4 py-2 text-center align-middle whitespace-nowrap", className)}
    >
    <div className="inline-flex items-center justify-center gap-2 text-blue-600">
      <Edit className="w-4 h-4 text-gray-400" />
      <a
        href={href}
        className="hover:underline"
        title={fullText}
      >
      {displayText}
      </a>
    </div>
    </td>
  )
}


type TableCellDatePickerProps = {
  value?: string // formato: "YYYY-MM-DD"
  onChange?: (date: string) => void
  className?: string
}

type TableCellActionsProps = {
  onView?: () => void
  onDelete?: () => void
  className?: string
}

function TableCellActions({ onView, onDelete, className }: TableCellActionsProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn("px-4 py-2 text-center align-middle whitespace-nowrap", className)}
    >
      <div className="inline-flex items-center justify-center gap-3 text-gray-600">
        <button onClick={onView} title="Visualizar">
          <Eye className="w-5 h-5 hover:text-blue-600 transition-colors" />
        </button>
        <button onClick={onDelete} title="Excluir">
          <Trash2 className="w-5 h-5 hover:text-red-600 transition-colors" />
        </button>
      </div>
    </td>
  )
}

function TableCellDatePicker({
  value,
  onChange,
  className,
}: TableCellDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value || "")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    onChange?.(e.target.value)
  }

  return (
    <td
      data-slot="table-cell"
      className={cn("px-4 py-2 text-center align-middle whitespace-nowrap", className)}
    >
      <input
        type="date"
        value={selectedDate}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm text-gray-700 cursor-pointer"
      />
    </td>
  )
}


function TableCaption({
  className,
  ...props
}: React.ComponentProps<"caption">) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("text-muted-foreground mt-4 text-sm", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCellTag,
  TableCellLink,
  TableCellDatePicker,
  TableCellActions,
  TableCaption,
}
