import { ReactElement, useState } from 'react'
import { TEInput } from 'tw-elements-react'
import Modal from '../../helpers/Modal'
import { useNavigate, useParams } from 'react-router-dom'
import { MetaUrl } from '../../../../../common/constants'
import { createMetaUrl } from '../../../../../common/utils/url'
import { ModelForm } from '../../common/FormatFormNode.js'
import { usePipeline } from '../../hooks/use-pipeline.js'
import Pipeline from '../../../../../common/dto/Pipeline.js'
import MetaModel from '../../../../../common/dto/MetaModel.js'
import { useProcessorList } from '../../hooks/use-processor-list.js'
import { Select } from '../../common/Inputs.js'
import { ProcessorInfo } from '../../../../../main/processing/Processor.js'
import { Button } from '../../common/Buttons.js'
import { VscAdd } from 'react-icons/vsc'

export default function PipelineEditor(): ReactElement {
  const pipeId = useParams()['pipe']

  const { pipeline, setPipeline } = usePipeline(pipeId)
  const { processorList } = useProcessorList()

  function copyPipeline(pipe: Pipeline): Pipeline {
    return new Pipeline(pipe.id, pipe.name, pipe.changedOn, pipe.processorConfigs)
  }

  function setPipelineProp<T extends keyof Pipeline>(key: T, val: Pipeline[T]) {
    const copy = copyPipeline(pipeline!)
    copy[key] = val
    setPipeline(copy)
    setIsChanged(true)
    updateDocumentTitle()
  }

  function addPipelineProcessor(proc: ProcessorInfo) {
    const copy = copyPipeline(pipeline!)
    copy.processorConfigs.push({
      name: proc.name,
      config: new MetaModel(proc.configFormat)
    })
  }

  function updateModel(idx: number, model: MetaModel) {
    const copy = copyPipeline(pipeline!)
    copy.processorConfigs[idx].config = model
    setIsChanged(true)
    setPipeline(copy)
    console.log('updateModel(', idx, ',', model, ') ', pipeline, ' -->', copy)
  }

  function updateDocumentTitle() {
    document.title = pipeline
      ? `${Pipeline.name} - ${pipeline.name}${isChanged ? '*' : ''}`
      : 'Knowledge Base Editor'
  }

  const [isModalShown, setIsModalShown] = useState<boolean>(false)
  const [isChanged, setIsChanged] = useState<boolean>(false)

  const [isNewProcessorModalShown, setIsNewProcessorModalShown] = useState<boolean>(false)
  const [selectedNewProcessorIdx, setSelectedNewProcessorIdx] = useState<number | undefined>(
    undefined
  )

  const navigation = useNavigate()

  updateDocumentTitle()

  return (
    <div>
      <div className="flex justify-center pt-6 min-h-[10vh] bg-gradient-to-t from-white to-gray-100">
        <div className="relative mb-3 md:w-96">
          <TEInput
            type="text"
            label="Pipeline name"
            size="lg"
            className="mb-6"
            value={pipeline?.name ?? ''}
            onChange={(ev) => setPipelineProp('name', ev.target.value)}
          />
        </div>
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-center">
        {pipeline ? (
          pipeline.processorConfigs.map(({ name, config }, i) => (
            <div className="block w-3/4 rounded-lg bg-white px-6 py-3">
              {<ModelForm key={i} model={config} onChange={(model) => updateModel(i, model)} />}
            </div>
          ))
        ) : (
          <div>Pipelines are loading...</div>
        )}
        {pipeline && (
          <div className="p-2 flex justify-center">
            <Button
              xl
              className="rounded-lg"
              onClick={() => setIsNewProcessorModalShown(true)}
            >
              <VscAdd />
            </Button>
          </div>
        )}
      </div>
      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
      <div className="flex justify-around">
        <button onClick={() => (isChanged ? setIsModalShown(true) : navigation(-1))} className="">
          Back
        </button>
        <button
          onClick={() => {
            if (!pipeline) throw new Error('Unable to save if no format selected.')
            window.api.updatePipeline(pipeline)
            setIsChanged(false)
          }}
          disabled={!Pipeline}
          className=""
        >
          Save
        </button>
      </div>

      <Modal
        title="New pipeline processor"
        isShown={isNewProcessorModalShown}
        setIsShown={setIsNewProcessorModalShown}
        hasCloseButton={true}
        buttonConfig={[
          {
            text: 'Cancel',
            onClick: () => true
          },
          {
            text: 'Add',
            onClick: () => {
              if (selectedNewProcessorIdx === undefined)
                throw new Error("Won't happen")
              addPipelineProcessor(processorList[selectedNewProcessorIdx])
              return true
            }
          }
        ]}
      >
        <Select
          data={processorList.map((proc, i) => ({ text: proc.name, value: i }))}
          onChange={(e) => setSelectedNewProcessorIdx(+e.target.value)}
          value={selectedNewProcessorIdx}
        />
      </Modal>

      <Modal
        title="Discard changes?"
        isShown={isModalShown}
        setIsShown={setIsModalShown}
        hasCloseButton={true}
        buttonConfig={[
          {
            text: 'Yes',
            onClick: () => {
              navigation(createMetaUrl(MetaUrl.Pipeline))
              return true
            }
          },
          { text: 'No', onClick: () => true }
        ]}
      >
        This knowledge base is not saved. Are you sure you want to go back and discard?
      </Modal>
    </div>
  )
}
