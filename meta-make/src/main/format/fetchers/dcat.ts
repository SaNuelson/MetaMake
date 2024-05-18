import $rdf, { BlankNode, NamedNode, Namespace } from "rdflib";
import { promisify } from "util";
import { Literal } from "rdflib/lib/tf-types.js";
import {JsonLdSerializer} from "jsonld-streaming-serializer";
import { CodebookEntry } from "../../../common/dto/CodebookEntry.js";
import MetaModel, { MetaDatum, PrimitiveMetaDatum, StructuredMetaDatum } from "../../../common/dto/MetaModel.js";
import DcatApCz from "../DcatApCz.js";
import MetaProperty, { StructuredMetaProperty } from "../../../common/dto/MetaProperty.js";
import { ArityBounds, MandatoryArity } from "../../../common/dto/ArityBounds.js";
import knowledgeBaseManager from "../../kb/KnowledgeBaseManager.js";
import MetaStore from "../../data/MetaStore.js";
import { LogLevel } from "../../../common/constants.js";

const parseRdf = promisify($rdf.parse);

const applicationRdfXml = "application/rdf+xml";

const euCodebookPrefix = 'http://eurovoc.europa.eu';
const SKOS = Namespace('http://www.w3.org/2004/02/skos/core#');

export async function getEuCodebook(url: string, language: string): Promise<CodebookEntry[]> {
  // const CBOOK = Namespace(url);

  const codebook: CodebookEntry[] = [];

  if (MetaStore.logLevel >= LogLevel.Diagnostic)
    console.log(`fetch(${url})`);
  const res = await fetch(url);
  const txt = await res.text();

  const store = $rdf.graph();

  await parseRdf(txt, store, euCodebookPrefix, applicationRdfXml);

  var statements = store.statementsMatching(undefined, SKOS('inScheme'), $rdf.sym(url));
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    const entryIri = statement.subject.value;

    if (MetaStore.logLevel >= LogLevel.Diagnostic)
      console.log(`fetch(${entryIri})`);
    const subRes = await fetch(entryIri);
    const subTxt = await subRes.text();

    await parseRdf(subTxt, store, url, applicationRdfXml);

    const labels = store.statementsMatching(statement.subject, SKOS('prefLabel'));

    const langLabel = labels.find(stm=> (stm.object as Literal).language === language)?.object?.value ?? 'UNKNOWN';

    const value: CodebookEntry = {uri: entryIri, value: langLabel}
    codebook.push(value);
  }
  return codebook;
}

export function exportDCAT(model: MetaModel): string {
  const store = $rdf.graph();

  if (model.metaFormat.name !== DcatApCz.name) {
    throw new Error(`Unable to export non-DCAT format using DCAT exporter.`);
  }

  function walk(node: BlankNode, arity: ArityBounds, data: MetaDatum | MetaDatum[], prop: MetaProperty) {
    if (Array.isArray(data)) {
      for (const child of data) {
        walk(node, arity, child, prop);
      }
      return;
    }

    if (!prop.uri) {
      console.error(`Missing URI on property ${prop.name}`);
      return;
    }

    if (data instanceof PrimitiveMetaDatum) {
      const predicate = new NamedNode(prop.uri);

      if (!data.value) {
        console.error(`Invalid value of ${prop.name} = ${data.value}`)
        return;
      }

      const object = new $rdf.Literal(data.value)
      store.add(node, predicate, object)
    }

    const predicate = new NamedNode(prop.uri);
    const subNode = new BlankNode();
    store.add(node, predicate, subNode);

    if (!(prop instanceof StructuredMetaProperty)) {
      console.error(`Property ${prop.name} is not structured as expected`);
      return;
    }

    if (!(data instanceof StructuredMetaDatum)) {
      console.error(`MetaDatum ${data.name} is not strucutured as expected`);
      return;
    }

    for (const key in prop.children) {
      const {arity: subArity, property: subProp} = prop.children[key];
      const subData = data.data[key];
      walk(subNode, subArity, subData, subProp);
    }
  }

  const dataset = new BlankNode();
  // TODO: Fix serialization (or remove ofc)
  const format = knowledgeBaseManager.getMetaFormat(model.metaFormat.name);
  walk(dataset, MandatoryArity, model.root, format!.metaProps);

  const jsonldSerializer = new JsonLdSerializer({space: '  '})

  jsonldSerializer.pipe(process.stdout);
  for (let statement of store.statements) {

    jsonldSerializer.write(statement);
  }
  jsonldSerializer.end()

  return "";
}
