import MetaModel from "../../common/dto/MetaModel.js";
import MetaFormat from "../../common/dto/MetaFormat.js";
import DataSource from "../data/DataSource.js";

// TODO: Constraints
// TODO: Settings

export interface Processor {

  getName(): string;

  /**
   * Initialize this processor for processing.
   * Will be called before execute and, getInputFormats and getOutputFormats.
   * @param targetFormat Final output MetaFormat of the MetaMake pipeline.
   * @param knownFormats List of all known and available MetaFormats.
   */
  initialize(targetFormat: MetaFormat, knownFormats: MetaFormat[]): void

  /**
   * Get meta formats which can be consumed by this processor
   */
  getInputFormats(): MetaFormat[]

  /**
   * Get meta format which will be produced by this processor
   */
  getOutputFormat(): MetaFormat

  /**
   * Run this processor and create a new MetaModel.
   * @param dataSource Data source of the data - provides access to data content and contextual metadata.
   * @param inputModels Map of existing MetaModelss, grouped by MetaFormat which they are built in.
   */
  execute(dataSource: DataSource, inputModels: Map<MetaFormat, MetaModel[]>): Promise<MetaModel>
}
