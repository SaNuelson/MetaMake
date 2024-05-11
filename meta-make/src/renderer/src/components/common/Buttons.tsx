import React from "react";

const activeCss = 'inline-block bg-primary uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] ';
const disabledCss = 'inline-block bg-secondary uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#a7b2c4] transition duration-150 ease-in-out pointer-events-none ';

const tinyCss = 'px-1 pb-[2px] pt-[3px] text-xs font-medium';
const smallCss = 'px-2 pb-[5px] pt-[6px] text-xs font-medium ';
const mediumCss = 'px-4 pb-2 pt-2.5 text-xs font-medium ';
const largeCss = 'px-7 pb-2.5 pt-3 text-sm font-medium ';
const chungusCss = 'px-9 pb-3 pt-3.5 text-md font-medium ';

function getSizeCss( xsm?: boolean, sm?: boolean, _?: boolean, lg?: boolean, xl?: boolean): string {
  if (xl)
    return chungusCss;
  if (lg)
    return largeCss;
  if (sm)
    return smallCss;
  if (xsm)
    return tinyCss;
  return mediumCss;
}

// type RoundednessPosition = 'n' | 'l' | 't' | 'r' | 'b' | 'a';
// type RoundednessAmount = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
// type Roundedness = `${RoundednessPosition}-${RoundednessAmount}`;
type Roundedness = 'none'|'left'|'top'|'right'|'bottom';
function getRoundedness(grouped?: Roundedness): string {
  if (!grouped)
    return 'rounded ';
  if (grouped === 'none')
    return '';
  return `rounded-${grouped[0]} `;
}

function getClassName({ className, disabled, xsm, sm, md, lg, xl, rounded }: Props) {
  return getRoundedness(rounded) + getSizeCss(xsm, sm, md, lg, xl) + (disabled ? disabledCss : activeCss) + (className ?? '')
}

interface Props {
  text?: string;
  className?: string
  disabled?: boolean

  xsm?: boolean
  sm?: boolean
  md?: boolean
  lg?: boolean
  xl?: boolean

  rounded?: Roundedness
}

interface ButtonLinkProps extends Props, React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>{
  href: string
}

export function ButtonLink({ text, className, disabled, href, xsm, sm, md, lg, xl, rounded, children, ...linkProps }: ButtonLinkProps) {
  return (
    <a
      href={href}
      className={getClassName({className, disabled, xsm, sm, md, lg, xl, rounded: rounded})}
      {...linkProps}
    >
      {children ?? text ?? 'NOTEXT'}
    </a>
  )
}

interface ButtonProps extends Props, React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
}

export function Button({ text, className, disabled, xsm, sm, md, lg, xl, rounded, children, ...buttonProps }: ButtonProps) {
  return (
    <button
      type="button"
      className={getClassName({className, disabled, xsm, sm, md, lg, xl, rounded: rounded})}
      disabled={disabled}
      {...buttonProps}
    >
      {children ?? text ?? 'NOTEXT'}
    </button>
  )
}
