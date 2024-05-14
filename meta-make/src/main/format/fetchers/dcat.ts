import $rdf, {BlankNode, Namespace} from "rdflib";
import { promisify } from "util";
import { Literal } from "rdflib/lib/tf-types.js";
import {JsonLdSerializer} from "jsonld-streaming-serializer";
import { CodebookEntry } from "../../../common/dto/CodebookEntry.js";

const parseRdf = promisify($rdf.parse);

const applicationRdfXml = "application/rdf+xml";

const euCodebookPrefix = 'http://eurovoc.europa.eu';
const SKOS = Namespace('http://www.w3.org/2004/02/skos/core#');

export async function getEuCodebook(url: string, language: string): Promise<CodebookEntry[]> {
  // const CBOOK = Namespace(url);

  const codebook: {uri: string, label: string}[] = [];

  const res = await fetch(url);
  const txt = await res.text();

  const store = $rdf.graph();

  await parseRdf(txt, store, euCodebookPrefix, applicationRdfXml);

  var statements = store.statementsMatching(undefined, SKOS('inScheme'), $rdf.sym(url));
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    const entryIri = statement.subject.value;

    const subRes = await fetch(entryIri);
    const subTxt = await subRes.text();

    await parseRdf(subTxt, store, url, applicationRdfXml);

    const labels = store.statementsMatching(statement.subject, SKOS('prefLabel'));

    const langLabel = labels.find(stm=> (stm.object as Literal).language === language)?.object?.value ?? 'UNKNOWN';

    codebook.push({uri: entryIri, label: langLabel});
  }
  return codebook;
}

const dct = Namespace("http://purl.org/dc/terms/")

export function exportDCAT(model): string {
  const store = $rdf.graph();

  const datovaSada = new BlankNode()
  const titlePredicate = dct("title")
  const titleValue = model.getValue(".Title")
  store.add(datovaSada, titlePredicate, titleValue)


  const jsonldSerializer = new JsonLdSerializer({space: '  '})

  jsonldSerializer.pipe(process.stdout);
  for (let statement of store.statements) {

    jsonldSerializer.write(statement);
  }
  jsonldSerializer.end()




}
