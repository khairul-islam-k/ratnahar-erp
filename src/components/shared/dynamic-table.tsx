import type { Key, ReactNode } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination } from "./pagination"

export type DynamicTableColumn<Row> = {
  key: keyof Row
  header: string
  render?: (value: Row[keyof Row], row: Row) => ReactNode
}

type DynamicTableProps<Row> = {
  columns: DynamicTableColumn<Row>[]
  data: Row[]
  getRowKey: (row: Row, index: number) => Key
  caption?: string
  emptyMessage?: string
  footer?: ReactNode
  toolbar?: ReactNode
  pagination?: {
    page: number
    total: number
    limit: number
    onPageChange: (page: number) => void
  }
}

function getCellValue<Row>(column: DynamicTableColumn<Row>, row: Row) {
  const value = row[column.key]
  return column.render
    ? column.render(value, row)
    : value == null
      ? "-"
      : String(value)
}

export function DynamicTable<Row>({
  columns,
  data,
  getRowKey,
  caption,
  emptyMessage = "No records found.",
  footer,
  pagination,
  toolbar,
}: DynamicTableProps<Row>) {
  return (
    <div className="space-y-3">
      {toolbar && (
        <div>{toolbar}</div>
      )}

      {/* Card layout on phones */}
      <div className="space-y-3 md:hidden">
        {caption && <h2 className="text-sm font-medium text-muted-foreground">{caption}</h2>}
        {data.length ? (
          data.map((row, index) => (
            <article
              key={getRowKey(row, index)}
              className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
            >
              <dl className="space-y-3">
                {columns.map((column) => (
                  <div
                    key={String(column.key)}
                    className="flex items-start justify-between gap-4"
                  >
                    <dt className="text-sm text-muted-foreground">{column.header}</dt>
                    <dd className="text-right text-sm font-medium">
                      {getCellValue(column, row)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          ))
        ) : (
          <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </div>
        )}
      </div>

      {/* Table layout on tablet and desktop */}
      <div className="hidden md:block">
        <Table>
          {caption && <TableCaption>{caption}</TableCaption>}
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={String(column.key)}>{column.header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length ? (
              data.map((row, index) => (
                <TableRow key={getRowKey(row, index)}>
                  {columns.map((column) => (
                    <TableCell key={String(column.key)}>
                      {getCellValue(column, row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={Math.max(columns.length, 1)}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footer && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={Math.max(columns.length, 1)}>{footer}</TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={pagination.onPageChange}
          className="pt-2"
        />
      )}
    </div>
  )
}
