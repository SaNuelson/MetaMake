import React, { useId, useState } from "react";

function joinEventHandlers<HTMLElementType extends HTMLElement>(...handlers: (React.FocusEventHandler<HTMLElementType> | undefined)[]): React.FocusEventHandler<HTMLElementType>{
  return function(event: React.FocusEvent<HTMLElementType>) {
    for (const handler of handlers) {
      if (event.defaultPrevented)
        return;
      if (handler) {
        handler(event);
      }
    }
  }
}

export interface OptionData {
  text: string
  value: string | number | undefined
}

interface SelectProps extends React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement> {
  data: OptionData[]
}

export function Select({ data, ...rest }: SelectProps) {
  return (
    <select className="min-w-48 p-1.5 rounded border-2 border-primary-200 bg-primary-50" {...rest}>
      {data.map((opt) => (
        <option value={opt.value}>{opt.text}</option>
      ))}
    </select>
  )
}

export interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
  label?: string,
  tooltip?: string,
  data?: OptionData[]
}

export function Input({ label, tooltip, type, className, data, ...rest }: InputProps) {
  const inputId = useId();
  const datalistId = useId();
  const [isActive, setIsActive] = useState(false);

  function onFocus() {
    setIsActive(true);
  }

  function onBlur() {
    setIsActive(false);
  }

  const isLabelCentered = !isActive && !rest.value;
  return (
    <div className={className}>
      {label &&
        <label htmlFor={inputId} className={'absolute select-none cursor-text px-2 transition-all ' +
          (isLabelCentered
            ? 'translate-y-2'
            : 'translate-x-1 -translate-y-[calc(100%+0.25rem)] text-sm rounded-t ')}
        >
          {label}
        </label>
      }
      <input
        id={inputId}
        placeholder=''
        className={'w-full p-1.5 rounded bg-primary-50 ' +
          (isActive
            ? 'outline-primary-500'
            : 'outline-primary-200')}
        onFocus={joinEventHandlers(onFocus, rest.onFocus)}
        onBlur={joinEventHandlers(onBlur, rest.onBlur)}
        type={!isLabelCentered ? type : 'text'}
        list={data && datalistId}
        {...rest}
      />
      {tooltip &&
        <small className={'transition-all duration-300 pt-2 pl-2 ease-linear block ' +
          (isActive
            ? 'max-h-36 text-secondary-800'
            : 'max-h-0 text-transparent invisible')}
        >
          {tooltip}
        </small>
      }
      {data &&
        <datalist id={datalistId}>
          {data.map(({text, value}) => <option value={value}>{text}</option>)}
        </datalist>
      }
    </div>
  )
}
