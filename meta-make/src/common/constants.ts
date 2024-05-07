export enum EventType {
  DataPreviewRequested = 'DataPreviewRequested',
  DataChanged = 'DataChanged',
  DataLoaded = 'DataLoaded',
  MetaFormatListRequested = 'MetaFormatListRequested',
  MetaFormatsRequested = 'MetaFormatsRequested',
  KnowledgeBaseListRequested = 'KnowledgeBaseListRequested',
  KnowledgeBaseRequested = 'KnowledgeBaseRequested',
  KnowledgeBaseUpdated = 'KnowledgeBaseUpdated',
  KnowledgeBaseDeleted = 'KnowledgeBaseDeleted',
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

export const Config = {
  kbPath: 'kbPath',
  kbList: 'kbList'
} as const;
