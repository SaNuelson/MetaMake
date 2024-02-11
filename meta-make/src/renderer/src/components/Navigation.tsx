import React from 'react'
import {
  TEDropdown,
  TEDropdownItem,
  TEDropdownMenu,
  TEDropdownToggle,
  TERipple
} from 'tw-elements-react'
export function Navigation(): React.JSX.Element {
  return (
    <nav>
      <ul className="flex flex-wrap w-full items-center justify-start bg-primary-100">
        <li>
          <NavDropdown title={'Data'}>
            <NavLink title={'Load data...'} />
            <NavLink title={'Load meta...'} />
          </NavDropdown>
        </li>
        <li>
          <NavDropdown title={'Knowledge base'}>
            <NavLink title={'New KB...'} />
            <NavLink title={'Load KB...'} />
            <NavLink title={'Manage KBs'} />
          </NavDropdown>
        </li>
      </ul>
    </nav>
  )
}

interface NavDropdownProps {
  title: String
  children: React.JSX.Element[]
}

function NavDropdown({ title, children }: NavDropdownProps): React.JSX.Element {
  return (
    <div>
      <TEDropdown>
        <TERipple rippleColor="light">
          <TEDropdownToggle className="flex items-center bg-primary-100 whitespace-nowrap px-6 pb-2 pt-2.5 leading-normal transition duration-150 ease-in-out hover:bg-primary-300 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-500 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]">
            {title}
            <span className="ml-2 [&>svg]:w-5 w-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </TEDropdownToggle>
        </TERipple>

        <TEDropdownMenu>
          {children.map((child, i) => (
            <TEDropdownItem>
              <a
                href="#"
                key={i}
                className="block w-full min-w-[160px] cursor-pointer whitespace-nowrap bg-primary-100 px-4 py-2 text-sm text-left font-normal pointer-events-auto text-neutral-700 hover:bg-primary-300 active:text-neutral-800 active:bg-primary-500 focus:bg-primary-500 focus:text-neutral-800 focus:outline-none active:no-underline"
              >
                {child}
              </a>
            </TEDropdownItem>
          ))}
        </TEDropdownMenu>
      </TEDropdown>
    </div>
  )
}

interface NavLinkProps {
  title: String
}

function NavLink({ title }: NavLinkProps): React.JSX.Element {
  return <button>{title}</button>
}
