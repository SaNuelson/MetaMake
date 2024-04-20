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
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
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

interface KBButtonProps {
  title: string
}

export function KBButton({ title }: KBButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]">
      {title}
    </button>
  );
}


export function KBButtonLink({ title, href, disabled = false }): React.JSX.Element {
  return (
    <a href={href}
      className={"inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]" + (disabled ? " pointer-events-none" : "")}>
      {title}
    </a>
  );
}
