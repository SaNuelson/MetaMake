import React from "react";

const smallCss = 'px-2 pb-[5px] pt-[6px] text-xs font-medium ';
const mediumCss = 'px-4 pb-2 pt-2.5 text-xs font-medium ';
const largeCss = 'px-7 pb-2.5 pt-3 text-sm font-medium ';

function getSizeCss(sm?: boolean, _?: boolean, lg?: boolean): string {
  if (lg)
    return largeCss;
  if (sm)
    return smallCss;
  return mediumCss;
}

const activeCss = 'inline-block rounded bg-primary uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] ';
const disabledCss = 'inline-block rounded bg-secondary uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#a7b2c4] transition duration-150 ease-in-out pointer-events-none ';

interface Props {
  text?: string;
  className?: string
  disabled?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
}

interface ButtonLinkProps extends Props, React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>{
  href: string
}

export function ButtonLink({ text, className, disabled, href, sm, md, lg, children, ...linkProps }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={getSizeCss(sm, md, lg) + (disabled ? disabledCss : activeCss) + (className ?? '')}
      {...linkProps}
    >
      {children ?? text ?? 'NOTEXT'}
    </a>
  )
}

interface ButtonProps extends Props, React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export function Button({ text, className, disabled, sm, md, lg, children, ...buttonProps }: ButtonProps) {
  return (
    <button
      type="button"
      className={getSizeCss(sm, md, lg) + (disabled ? disabledCss : activeCss) + (className ?? '')}
      disabled={disabled}
      {...buttonProps}
    >
      {children ?? text ?? 'NOTEXT'}
    </button>
  )
}
