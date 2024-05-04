export function pickMin<T>(arr: T[], select: (item: T) => any = x=> x): T {
  if (arr.length === 0)
    throw Error("Empty array");

  if (arr.length === 1) {
    return arr[0];
  }

  const [_, minIdx] = arr.slice(1).reduce(([minVal, minIdx], next, idx) => {
    const nextVal = select(next);
    if (nextVal < minVal)
      return [nextVal, idx];
    return [minVal, minIdx];
  }, [select(arr[0]), -1]);
  return arr[minIdx + 1];
}

export function pickMax<T>(arr: T[], select: (item: T) => any = x=> x): T {
  if (arr.length === 0)
    throw Error("Empty array");

  if (arr.length === 1)
    return arr[0];

  const [_, minIdx] = arr.slice(1).reduce(([maxVal, maxIdx], next, idx) => {
    const nextVal = select(next);
    if (nextVal > maxVal)
      return [nextVal, idx];
    return [maxVal, maxIdx];
  }, [select(arr[0]), -1]);
  return arr[minIdx + 1];
}
