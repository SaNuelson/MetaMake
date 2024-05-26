import MetaFormat from '../../common/dto/MetaFormat.js';
import MetaModel from '../../common/dto/MetaModel.js';
import DataSource from '../data/DataSource.js';
import { Processor } from './Processor.js'
import Property, { StructuredProperty } from '../../common/dto/Property.js'

export const JSONSchemaProcessorConfigFormat = new MetaFormat(
  "JSONSchemaProcessorConfigFormat",
  new StructuredProperty({
    name: "Config",
    description: "Configuration for the JSON Schema processor",
    propertyDefinitions: [
    ]
  })
)

export const JSONSchemaProcessorOutputFormat = new MetaFormat(
  "JSONSchemaProcessorOutputFormat",
  new Property({
    name: "JSONSchema",
    description: "JSON definition schema",
    type: 'string'
  })
)

class JSONSchemaProcessor implements Processor {

  config?: MetaModel;

  getName(): string {
    return 'JSONSchemaProcessor'
  }

  getDescription(): string {
    return 'Processor compressing (potentially partial) loaded JSON data into representing JSON Schema.'
  }

  initialize(targetFormat: MetaFormat, knownFormats: MetaFormat[], config?: MetaModel): void {
    this.config = config
  }

  getInputFormats(): MetaFormat[] {
    return [];
  }

  getConfigFormat(): MetaFormat {
    return JSONSchemaProcessorConfigFormat
  }

  getOutputFormat(): MetaFormat {
    return JSONSchemaProcessorOutputFormat
  }

  execute(dataSource: DataSource, inputModels: Map<MetaFormat, MetaModel[]>): Promise<MetaModel> {
    throw new Error('Method not implemented.')
  }
}

export default new JSONSchemaProcessor();
