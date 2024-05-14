import $rdf, { Namespace } from "rdflib";
import { promisify } from "util";
import { Literal } from "rdflib/lib/tf-types.js";

const parseRdf = promisify($rdf.parse);

const applicationRdfXml = "application/rdf+xml";

const euCodebookPrefix = 'http://publications.europa.eu';
const SKOS = Namespace('http://www.w3.org/2004/02/skos/core#');

export async function getEuCodebook(url: string, language: string): Promise<{uri: string, label: string}[]> {
  // const CBOOK = Namespace(url);

  const codebook: {uri: string, label: string}[] = [];

  if (!url.startsWith(euCodebookPrefix)) {
    throw new Error(`Invalid URL '${url}' for EU publicated codebooks. Expected base URI '${euCodebookPrefix}'`);
  }

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
