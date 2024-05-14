export enum EventType {
  // region GET STATE
  MetaBaseRequested = 'MetaBaseRequested',
  CheckDataProcessed = 'CheckDataProcessed',
  // endregion

  //region GET DATA
  DataPreviewRequested = 'DataPreviewRequested',

  MetaFormatListRequested = 'MetaFormatListRequested',
  MetaFormatsRequested = 'MetaFormatsRequested',

  KnowledgeBaseListRequested = 'KnowledgeBaseListRequested',
  KnowledgeBaseRequested = 'KnowledgeBaseRequested',

  LoadDataModalRequested = 'LoadDataModalRequested',
  //endregion

  //region SET
  KnowledgeBaseUpdated = 'KnowledgeBaseUpdated',
  KnowledgeBaseDeleted = 'KnowledgeBaseDeleted',
  SaveMetaModelRequested = 'SaveMetaModelRequested',
  //endregion

  //region CALL
  DataProcessingRequested = 'DataProcessingRequested',
  //endregion

  //region LISTEN
  DataChanged = 'DataChanged',
  DataLoaded = 'DataLoaded',
  DataProcessed = 'DataProcessed',
  //endregion
}

export enum MetaUrl {
  Index = "/",
  KnowledgeBase = "/kb/{}",
  KnowledgeBaseCreate = "/kb/create",
  MetaBase = "/mb/"
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
