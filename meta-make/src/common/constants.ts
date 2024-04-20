export enum EventType {
  DataPreviewRequested = 'DataPreviewRequested',
  DataChanged = 'DataChanged',
  DataLoaded = 'DataLoaded',
  MetaFormatListRequested = 'MetaFormatListRequested',
  MetaFormatsRequested = 'MetaFormatsRequested',
  KnowledgeBaseListRequested = 'KnowledgeBaseListRequested',
  KnowledgeBaseRequested = 'KnowledgeBaseRequested',
}

export enum Config {
  KBBasePath = 'kbBasePath'
}

export enum MetaUrl {
  Index = "/",
  KnowledgeBase = "/kb/{}",
  KnowledgeBaseCreate = "/kb/create"
}

export enum WindowType {
  Main = "Main",
  KBMan = "KnowledgeBaseManager",
  KBEdit = "KnowledgeBaseEditor"
}

