export enum EnvironmentKind {
  Renderer = 0,
  Main = 1
}

export function getEnvironmentKind(): EnvironmentKind {
  if (typeof window === 'undefined')
    return EnvironmentKind.Main;
  return EnvironmentKind.Renderer;
}
