import React, { ReactElement } from 'react'

interface TableProps {
  hasHeader?: boolean
  children: ReactElement<any, any>[]
}

export function Table({hasHeader = true, children}: TableProps): React.JSX.Element {
  const header = hasHeader ? <thead>{children[0]}</thead> : null;
  const rows = hasHeader ? children.slice(1): children;
  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <table className="min-w-full text-left text-sm font-light">
              {header}
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TableRow({children}): React.JSX.Element {
  return (
    <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
      {children}
    </tr>
  )
}

interface KnowledgeBaseTableRowProps {
  kbName: string
  format: string
  changedOn: string
  other: string
}

export function KnowledgeBaseTableRow({kbName, format, changedOn, other} : KnowledgeBaseTableRowProps): React.JSX.Element {
  return (
    <tr className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600">
      <td className="whitespace-nowrap px-6 py-4 font-medium">{kbName}</td>
      <td className="whitespace-nowrap px-6 py-4">{format}</td>
      <td className="whitespace-nowrap px-6 py-4">{changedOn}</td>
      <td className="whitespace-nowrap px-6 py-4">{other}</td>
    </tr>
  )
}

interface TableItemProps {
  title: string
}

export function TableItem({title}: TableItemProps) {
  return (
    <td className="whitespace-nowrap px-6 py-4">{title}</td>
  )
}
