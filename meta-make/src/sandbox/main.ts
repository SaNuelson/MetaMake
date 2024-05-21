import { MemoryLevel } from 'memory-level';
import { DataFactory, BlankNode } from 'rdf-data-factory';
import { Quadstore } from 'quadstore'
import { Engine } from 'quadstore-comunica';
import DcatApCz from "../main/format/DcatApCz.js";
import { KnowledgeBase } from "../common/dto/KnowledgeBase.js";
import {MetaDatum, PrimitiveMetaDatum, StructuredMetaDatum} from '../common/dto/MetaModel.js'
import SerializerJsonld from '@rdfjs/serializer-jsonld-ext'
import {writeFileSync} from "node:fs";
import {ArityBounds, MandatoryArity} from "../common/dto/ArityBounds.js";
import MetaProperty, {StructuredMetaProperty} from "../common/dto/MetaProperty.js";


// Any implementation of AbstractLevel can be used.
const backend = new MemoryLevel();

// Implementation of the RDF/JS DataFactory interface
const df = new DataFactory();

// Store and query engine are separate modules
const store = new Quadstore({backend, dataFactory: df});
const engine = new Engine(store);

async function walk(node: BlankNode | null, arity: ArityBounds, data: MetaDatum | MetaDatum[], prop: MetaProperty): BlankNode {
  console.log(prop.name)

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

  if (!(prop instanceof StructuredMetaProperty)) {
    console.error(`Property ${prop.name} is not structured as expected`);
    return node;
  }

  if (!(data instanceof StructuredMetaDatum)) {
    console.error(`MetaDatum ${data.name} is not strucutured as expected`);
    return node;
  }

  for (const key in prop.children) {
    const {arity: subArity, property: subProp} = prop.children[key];
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

const kb = new KnowledgeBase('testkb', "TestKB", DcatApCz);

kb.model.setValue(".Název", "My DCAT Test Model Title");
const [titleArity, titleProp, titleMeta] = kb.model.getData(".Název");

kb.model.setValue(".Popis", "My DCAT Test Model Description");
const [descArity, descProp, descMeta] = kb.model.getData(".Popis");

kb.model.setValue(".Klíčová slova[0]", "Keyword 1");
kb.model.setValue(".Klíčová slova[1]", "Keyword 2");


// Put a single quad into the store using Quadstore's API

const dataset = await walk(null, MandatoryArity, kb.model.root, DcatApCz.metaProps);
await store.put(df.quad(
  dataset,
  df.namedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#type"),
  df.namedNode("http://www.w3.org/ns/dcat#Dataset"),
  df.defaultGraph(),
));

// Retrieves all quads using Quadstore's API
const { items } = await store.get({subject: df.blankNode("Distribuce datové sady")});

const { items2 } = await store.get({object: df.blankNode("Distribuce datové sady")});


// Retrieves all quads using RDF/JS Stream interfaces
const quadsStream = store.match(undefined, undefined, undefined, undefined);
const serializerJsonld = new SerializerJsonld({
  context: 'https://ofn.gov.cz/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat/2021-01-11/kontexty/rozhran%C3%AD-katalog%C5%AF-otev%C5%99en%C3%BDch-dat.jsonld',
  compact: true,
  encoding: 'string',
  prettyPrint: true
})
const output = serializerJsonld.import(quadsStream)

output.on('data', jsonld => {
  console.log(jsonld)
  writeFileSync('test.jsonld.txt', jsonld)
})
