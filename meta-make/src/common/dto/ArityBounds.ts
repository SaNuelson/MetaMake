export interface ArityBounds {
  min?: number
  max?: number
}

export interface Arity extends ArityBounds {
  current: number
}

export function isValidArity(obj: any) {
  if (typeof obj !== 'object')
    return false;

  if (obj.min !== undefined && obj.max !== undefined && obj.min > obj.max)
    return false;

  if (obj.min !== undefined && obj.min < 0)
    return false;

  if (obj.max !== undefined && obj.max < 0)
    return false;

  return true;
}

export const MandatoryArity: ArityBounds = { min: 1, max: 1 }
export function isMandatory(arity: ArityBounds): boolean {
  return arity.min === 1 && arity.max === 1;
}

export const OptionalArity: ArityBounds = { min: 0, max: 1 }
export function isOptional(arity: ArityBounds): boolean {
  return (arity.min === undefined || arity.min === 0) && arity.max === 1;
}

export function isScalar(arity: ArityBounds): boolean {
  return isMandatory(arity) || isOptional(arity);
}

export const UnboundedArity: ArityBounds = { min: 0 }
export function isUnbounded(arity: ArityBounds): boolean {
  return (!arity.min || arity.min === 0) && arity.max === undefined;
}

export const OneOrMoreArity: ArityBounds = { min: 1 }
export function isOneOrMore(arity: ArityBounds): boolean {
  return arity.min === 1 && arity.max === undefined;
}

