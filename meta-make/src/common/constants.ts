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

  Pipeline = "/pipe/{}",
  PipelineCreate = "/pipe/create",

  MetaBase = "/mb/"
}

export enum WindowType {
  Main = "Main",
  KBMan = "KnowledgeBaseManager",
  KBEdit = "KnowledgeBaseEditor"
}

export const Config = {
  kbPath: 'kbPath',
  kbList: 'kbList',
  logLevel: 'logLevel'
} as const;

export enum LogLevel {
  Error = 0,
  Warning = 1,
  Log = 2,
  Verbose = 3,
  Diagnostic = 4,
}
