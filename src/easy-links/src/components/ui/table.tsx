import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Edit, Eye, Trash2, ClipboardCopy } from "lucide-react";
import { Input } from "@/components/ui/input";

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
  );
}

function TableHeader({ className, ...props }: React.ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

function TableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
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
  );
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
  );
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
  );
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
  );
}

type CellNameProps = {
  value: string;
  onChange: (newValue: string) => void;
};

function CellName({ value, onChange }: CellNameProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(tempValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
      onChange(tempValue);
    }
  };

  return (
    <TableCell onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <Input
          type="text"
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="border rounded px-2 py-1 text-sm w-full"
        />
      ) : (
        value
      )}
    </TableCell>
  );
}

type CellTagProps = {
  children: React.ReactNode;
  className?: string;
};

function CellTag({ children, className }: CellTagProps) {
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
  );
}

type CellLinkProps = {
  href: string;
  onChange: (newHref: string) => void;
  maxLength?: number;
  className?: string;
};

function CellLink({
  href,
  maxLength = 30,
  className,
  onChange,
}: CellLinkProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempHref, setTempHref] = useState(href);

  useEffect(() => {
    setTempHref(href);
  }, [href]);

  const getDisplayUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.replace(/^www\./, "");
      const path = parsed.pathname.replace(/\/$/, "");
      return `${hostname}${path}`;
    } catch {
      return url;
    }
  };

  const fullText = getDisplayUrl(href);
  const shouldTruncate = fullText.length > maxLength;
  const displayText = shouldTruncate
    ? fullText.slice(0, maxLength) + "..."
    : fullText;

  const handleSubmit = () => {
    setIsEditing(false);
    onChange(tempHref);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-2 text-center align-middle whitespace-nowrap",
        className
      )}
    >
      {isEditing ? (
        <Input
          type="text"
          value={tempHref}
          onChange={(e) => setTempHref(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          autoFocus
          className="border rounded px-2 py-1 text-sm w-full"
        />
      ) : (
        <div className="inline-flex items-center justify-center gap-2">
          <Edit
            className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-700 transition-colors"
            onClick={() => setIsEditing(true)}
          />
          <a
            target="_blank"
            href={href}
            className="hover:underline text-blue-600"
            title={fullText}
          >
            {displayText}
          </a>
        </div>
      )}
    </td>
  );
}

type CellDatePickerProps = {
  value?: string; // formato: "YYYY-MM-DD"
  onChange?: (date: string) => void;
  className?: string;
};

function CellDatePicker({ value, onChange, className }: CellDatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(value || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-2 text-center align-middle whitespace-nowrap",
        className
      )}
    >
      <Input
        type="date"
        value={selectedDate}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-sm text-gray-700 cursor-pointer"
      />
    </td>
  );
}

type CellActionsProps = {
  onView?: () => void;
  onDelete?: () => void;
  className?: string;
};

function CellActions({ onView, onDelete, className }: CellActionsProps) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "px-4 py-2 text-center align-middle whitespace-nowrap",
        className
      )}
    >
      <div className="inline-flex items-center justify-center gap-3 text-gray-600">
        <button onClick={onView} title="Visualizar">
          <ClipboardCopy className="w-5 h-5 hover:text-blue-600 transition-colors" />
        </button>
        <button onClick={onDelete} title="Excluir">
          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700 transition-colors cursor-pointer" />
        </button>
      </div>
    </td>
  );
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
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  CellTag,
  CellLink,
  CellDatePicker,
  CellActions,
  CellName,
};
