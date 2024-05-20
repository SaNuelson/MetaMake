import { MemoryLevel } from 'memory-level';
import { DataFactory } from 'rdf-data-factory';
import { Quadstore } from 'quadstore'
import { Engine } from 'quadstore-comunica';
import DcatApCz from "../main/format/DcatApCz.js";
import { KnowledgeBase } from "../common/dto/KnowledgeBase.js";
import { PrimitiveMetaDatum } from '../common/dto/MetaModel.js'
import SerializerJsonld from '@rdfjs/serializer-jsonld'
import { Readable } from 'stream'

// Any implementation of AbstractLevel can be used.
const backend = new MemoryLevel();

// Implementation of the RDF/JS DataFactory interface
const df = new DataFactory();

// Store and query engine are separate modules
const store = new Quadstore({backend, dataFactory: df});
const engine = new Engine(store);

// Open the store
await store.open();

const kb = new KnowledgeBase('testkb', "TestKB", DcatApCz);

kb.model.setValue(".Název", "My DCAT Test Model Title");
const [titleArity, titleProp, titleMeta] = kb.model.getData(".Název");

kb.model.setValue(".Popis", "My DCAT Test Model Description");
const [descArity, descProp, descMeta] = kb.model.getData(".Popis");

kb.model.setValue(".Poskytovatel", "My DCAT Test Model Provider");
const [providerArity, providerProp, providerMeta] = kb.model.getData(".Poskytovatel");

// Put a single quad into the store using Quadstore's API
await store.put(df.quad(
  df.blankNode("DataSet"),
  df.namedNode(titleProp.data.uri),
  df.literal((titleMeta as PrimitiveMetaDatum<string>).value),
  df.defaultGraph(),
));
await store.put(df.quad(
  df.blankNode("DataSet"),
  df.namedNode(descProp.data.uri),
  df.literal((descMeta as PrimitiveMetaDatum<string>).value),
  df.defaultGraph(),
));
await store.put(df.quad(
  df.blankNode("DataSet"),
  df.namedNode(providerProp.data.uri),
  df.literal((providerMeta as PrimitiveMetaDatum<string>).value),
  df.defaultGraph(),
));

// Retrieves all quads using Quadstore's API
const { items } = await store.get({});

// Retrieves all quads using RDF/JS Stream interfaces
const quadsStream = store.match(undefined, undefined, undefined, undefined);
const serializerJsonld = new SerializerJsonld({
  space: '  ',
  context: 'https://ofn.gov.cz/rozhraní-katalogů-otevřených-dat/2021-01-11/kontexty/rozhraní-katalogů-otevřených-dat.jsonld'
})
const output = serializerJsonld.import(quadsStream)

output.on('data', jsonld => {
  console.log(jsonld)
})
