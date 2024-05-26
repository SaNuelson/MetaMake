import $rdf, { Namespace } from 'rdflib'
import { promisify } from 'util'
import { Literal as RdfLibLiteral } from 'rdflib/lib/tf-types.js'
import { CodebookEntry } from '../../../../common/dto/CodebookEntry.js'
import MetaModel, {
  isListMetaDatum,
  isPrimitiveMetaDatum,
  isStructuredMetaDatum,
  MetaDatum,
} from '../../../../common/dto/MetaModel.js'
import DcatApCz from '../DcatApCz.js'
import Property, { ListProperty, StructuredProperty } from '../../../../common/dto/Property.js'
import { DataFactory, BlankNode, Literal } from 'rdf-data-factory'
import { MemoryLevel } from 'memory-level'
import { Quadstore } from 'quadstore'
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext'
import { once } from 'events'
import MetaStore from '../../../data/MetaStore.js'
import { LogLevel } from '../../../../common/constants.js'
import MetaFormatManager from '../../../manager/MetaFormatManager.js'

const parseRdf = promisify($rdf.parse)

const applicationRdfXml = 'application/rdf+xml'

const euCodebookPrefix = 'http://eurovoc.europa.eu'
const SKOS = Namespace('http://www.w3.org/2004/02/skos/core#')

export async function getEuCodebook(url: string, language: string): Promise<CodebookEntry[]> {
  // const CBOOK = Namespace(url);

  const codebook: CodebookEntry[] = []

  if (MetaStore.logLevel >= LogLevel.Diagnostic) console.log(`fetch(${url})`)
  const res = await fetch(url)
  const txt = await res.text()

  const store = $rdf.graph()

  await parseRdf(txt, store, euCodebookPrefix, applicationRdfXml)

  var statements = store.statementsMatching(undefined, SKOS('inScheme'), $rdf.sym(url))
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i]

    const entryIri = statement.subject.value

    if (MetaStore.logLevel >= LogLevel.Diagnostic) console.log(`fetch(${entryIri})`)
    const subRes = await fetch(entryIri)
    const subTxt = await subRes.text()

    await parseRdf(subTxt, store, url, applicationRdfXml)

    const labels = store.statementsMatching(statement.subject, SKOS('prefLabel'))

    const langLabel =
      labels.find((stm) => (stm.object as RdfLibLiteral).language === language)?.object?.value ??
      'UNKNOWN'

    const value: CodebookEntry = { uri: entryIri, value: langLabel }
    codebook.push(value)
  }
  return codebook
}

export async function exportDCAT(model: MetaModel): Promise<string> {
  // Any implementation of AbstractLevel can be used.
  const backend = new MemoryLevel()

  // Implementation of the RDF/JS DataFactory interface
  const df = new DataFactory()

  // Store and query engine are separate modules
  const store = new Quadstore({ backend, dataFactory: df })

  if (model.metaFormat.name !== DcatApCz.name) {
    throw new Error(`Unable to export non-DCAT format using DCAT exporter.`)
  }

  let nodeCounter = 0

  async function walk(
    datum: MetaDatum,
    prop: Property
  ): Promise<BlankNode | Literal | BlankNode[] | Literal[] | null> {
    /*
     * Primitive -> make literal, add to nearest anc. node
     * List      -> rec. run on each child, add each child to nearest anc. node
     * Structure -> make blank node, rec. run each child, add each child to self
     */

    if (isPrimitiveMetaDatum(datum)) {
      // TODO: Language
      if (datum.value === null)
        return null;
      return df.literal(datum.value, 'cs')
    }

    if (isListMetaDatum(datum)) {
      if (!(prop instanceof ListProperty)) {
        console.error(`Found list datum ${datum.name}, but property was not.`)
        return null
      }

      // TODO: List with nulls (shouldn't happen if format well-formed)
      // TODO: List of lists (might accomodate later on, is obscure enough to ignore for now)
      // @ts-ignore
      return Promise.all(datum.values.map((subDatum) => walk(subDatum, prop.itemProperty)))
    }

    const subject = df.blankNode(`(${nodeCounter++})${prop.name}`)

    const classUri: string = prop.data.uri
    if (!classUri) {
      console.error(`Missing class URI on property ${prop.name}`)
      return null
    }

    if (isStructuredMetaDatum(datum)) {
      if (!(prop instanceof StructuredProperty)) {
        console.error(`Found structured datum ${datum.name}, but property was not.`)
        return null
      }

      for (const key in prop.propertyDefinitions) {
        const { property: subProp, uri: predicateUri } = prop.propertyDefinitions[key]
        const subData = datum.data[key]

        if (!predicateUri) {
          console.error(`Missing predicate URI on property ${prop.name} w.r.t. ${subProp.name}.`)
          continue;
        }

        const predicate = df.namedNode(predicateUri)
        const object = await walk(subData, subProp)

        if (Array.isArray(object)) {
          for (const obj of object) {
            if (obj === null)
              continue;
            console.log("EXP ARR", "\n - ", subject, "\n - ", predicate, "\n - ", obj);
            await store.put(df.quad(subject, predicate, obj, df.defaultGraph()));
          }
        }
        else if (object !== null) {
          console.log("EXP ONE", "\n - ", subject, "\n - ", predicate, "\n - ", object);
          await store.put(df.quad(subject, predicate, object, df.defaultGraph()))
        }
      }

      return subject;
    }

    console.error(`Got unknown metadatum ${JSON.stringify(datum)}`);
    return null;
  }

  // Open the store
  await store.open()

  const format = MetaFormatManager.getMetaFormat(model.metaFormat.name)

  const dataset = await walk(model.root, format!.metaProps)
  if (Array.isArray(dataset) || dataset instanceof Literal || dataset === null) {
    console.error("Invalid expored dataset", dataset);
    return "";
  }
  await store.put(
    df.quad(
      dataset,
      df.namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
      df.namedNode('http://www.w3.org/ns/dcat#Dataset'),
      df.defaultGraph()
    )
  )

  // Retrieves all quads using RDF/JS Stream interfaces
  const quadsStream = store.match(undefined, undefined, undefined, undefined)
  const serializerJsonld = new SerializerJsonld({
    context:
      'https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/2021-01-11/kontexty/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat.jsonld',
    compact: true,
    encoding: 'string',
    prettyPrint: true
  })
  const output = serializerJsonld.import(quadsStream)
  const res = await once(output, 'data')
  if (res.length > 1) {
    if (MetaStore.logLevel >= LogLevel.Error) {
      console.error('SerializerJsonld returned more than one result', res)
    }
  }
  return res[0]
}
