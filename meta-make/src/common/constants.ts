export enum EventType {
  DataPreviewRequested = 'DataPreviewRequested',
  DataChanged = 'DataChanged',
  DataLoaded = 'DataLoaded',
  MetaFormatListRequested = 'MetaFormatListRequested',
  MetaFormatsRequested = 'MetaFormatsRequested',
}

export enum Config {
  KBBasePath = 'kbBasePath'
}

export enum MetaUrl {
  Index = "/",
  KnowledgeBase = "/kb/",
  KnowledgeBaseCreate = "/kb/create"
}

export enum WindowType {
  Main = "Main",
  KBMan = "KnowledgeBaseManager",
  KBEdit = "KnowledgeBaseEditor"
}

export function getMetaUrl(type: MetaUrl, ...args: any[]): string {
  switch(type) {
    case MetaUrl.KnowledgeBase:
      return type + args[0];
    default:
      return type;
  }
}
