import $rdf, { Namespace } from "rdflib";
import { promisify } from "util";
import { Literal } from "rdflib/lib/tf-types.js";
import { CodebookEntry } from '../../../../common/dto/CodebookEntry.js'
import MetaModel, { MetaDatum, PrimitiveMetaDatum, StructuredMetaDatum } from '../../../../common/dto/MetaModel.js'
import DcatApCz from "../DcatApCz.js";
import Property, { StructuredProperty } from '../../../../common/dto/Property.js'
import { DataFactory, BlankNode } from 'rdf-data-factory';
import {MemoryLevel} from "memory-level";
import {Quadstore} from "quadstore";
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext'
import { once } from "events";
import MetaStore from '../../../data/MetaStore.js'
import { LogLevel } from '../../../../common/constants.js'
import { ArityBounds, MandatoryArity } from '../../../../common/dto/ArityBounds.js'
import MetaFormatManager from '../../../manager/MetaFormatManager.js'

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

export async function exportDCAT(model: MetaModel): Promise<string> {
  // Any implementation of AbstractLevel can be used.
  const backend = new MemoryLevel();

// Implementation of the RDF/JS DataFactory interface
  const df = new DataFactory();

// Store and query engine are separate modules
  const store = new Quadstore({backend, dataFactory: df});

  if (model.metaFormat.name !== DcatApCz.name) {
    throw new Error(`Unable to export non-DCAT format using DCAT exporter.`);
  }

  async function walk(node: BlankNode | null, arity: ArityBounds, data: MetaDatum | MetaDatum[], prop: Property): Promise<BlankNode> {
    // TODO: Fix returns
    if (Array.isArray(data)) {
      for (const child of data) {
        await walk(node, arity, child, prop);
      }
      return node;
    }

    const uri: string = prop.data.uri;
    if (!uri) {
      console.error(`Missing URI on property ${prop.name}`);
      return node;
    }

    if (data instanceof PrimitiveMetaDatum) {
      if (!data.value) {
        console.error(`Invalid value of ${prop.name} = ${data.value}`)
        return node;
      }

      await store.put(df.quad(
        node,
        df.namedNode(uri),
        df.literal(data.value, "cs"),
        df.defaultGraph(),
      ));
      return node;
    }

    const subNode = df.blankNode(prop.name);
    if (node != null) {
      await store.put(df.quad(
        node,
        df.namedNode(uri),
        subNode,
        df.defaultGraph(),
      ));
    }

    if (!(prop instanceof StructuredProperty)) {
      console.error(`Property ${prop.name} is not structured as expected`);
      return node;
    }

    if (!(data instanceof StructuredMetaDatum)) {
      console.error(`MetaDatum ${data.name} is not strucutured as expected`);
      return node;
    }

    for (const key in prop.propertyDefinitions) {
      const {arity: subArity, property: subProp} = prop.propertyDefinitions[key];
      const subData = data.data[key];
      await walk(subNode, subArity, subData, subProp);
    }
    if (!node) {
      return subNode;
    }
    return node;
  }

  // Open the store
  await store.open();

  const format = MetaFormatManager.getMetaFormat(model.metaFormat.name);

  const dataset = await walk(null, MandatoryArity, model.root, format!.metaProps);
  await store.put(df.quad(
    dataset,
    df.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
    df.namedNode("http://www.w3.org/ns/dcat#Dataset"),
    df.defaultGraph(),
  ));

  // Retrieves all quads using RDF/JS Stream interfaces
  const quadsStream = store.match(undefined, undefined, undefined, undefined);
  const serializerJsonld = new SerializerJsonld({
    context: 'https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/2021-01-11/kontexty/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat.jsonld',
    compact: true,
    encoding: 'string',
    prettyPrint: true
  })
  const output = serializerJsonld.import(quadsStream);
  const res =  await once(output, 'data');
  if (res.length > 1) {
    if (MetaStore.logLevel >= LogLevel.Error) {
      console.error('SerializerJsonld returned more than one result', res);
    }
  }
  return res[0]
}
