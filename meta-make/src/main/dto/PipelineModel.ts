import Pipeline from '../../common/dto/Pipeline.js'

export default class PipelineModel extends Pipeline {

  async save() {
    console.log("Save not implemented")
  }

  static load(pipeId: string): PipelineModel {
    throw new Error("Load not implemented")
  }
}
