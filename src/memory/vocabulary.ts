import { NamedNode, PrefixedToIri, Util, Writer } from 'n3';

import { logger } from '../logger';

export const prefixToUri: {[prefix: string]: string;} = {
    dbo: 'https://dbpedia.org/ontology/',
    rdf: 'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'https://www.w3.org/2000/01/rdf-schema#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    csvw: 'http://www.w3.org/ns/csvw#',
    mm: 'http://tempuri.org/metamake/',
    adms: 'http://www.w3.org/ns/adms#',
    dcat: 'http://www.w3.org/ns/dcat#',
    dcatAp: 'http://data.europa.eu/r5r/',
    dcterms: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    location: 'http://www.w3.org/ns/locn#',
    odrl: 'http://www.w3.org/ns/odrl/2/',
    prov: 'http://www.w3.org/ns/prov#',
    pu: 'https://data.gov.cz/slovník/podmínky-užití/',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    spdx: 'http://spdx.or;g/rdf/terms#',
    time: 'http://www.w3.org/2006/time#',
    vcard: 'http://www.w3.org/2006/vcard/ns#',
    nkod: 'https://data.gov.cz/slovník/nkod/',
} as const;

export const prefixToNamespace: { [prefix: string]: (localName: string) => NamedNode } = Object.fromEntries(
    Object.entries(prefixToUri).map(([p, uri]) => [p, Util.prefix(uri)])
);

export const uriToPrefix = Object.fromEntries(
    Object.entries(prefixToUri).map(([p, uri]) => [uri, p])
);

export const dbo = Util.prefix(prefixToUri.dbo);
export const rdf = Util.prefix(prefixToUri.rdf);
export const rdfs = Util.prefix(prefixToUri.rdfs);
export const xsd = Util.prefix(prefixToUri.xsd);
export const csvw = Util.prefix(prefixToUri.csvw);
export const mm = Util.prefix(prefixToUri.mm);
export const adms = Util.prefix(prefixToUri.adms);
export const dcat = Util.prefix(prefixToUri.dcat);
export const dcatAp = Util.prefix(prefixToUri.dcatAp);
export const dcterms = Util.prefix(prefixToUri.dcterms);
export const foaf = Util.prefix(prefixToUri.foaf);
export const location = Util.prefix(prefixToUri.location);
export const odrl = Util.prefix(prefixToUri.odrl);
export const prov = Util.prefix(prefixToUri.prov);
export const pu = Util.prefix(prefixToUri.pu);
export const skos = Util.prefix(prefixToUri.skos);
export const spdx = Util.prefix(prefixToUri.spdx);
export const time = Util.prefix(prefixToUri.time);
export const vcard = Util.prefix(prefixToUri.vcard);
export const nkod = Util.prefix(prefixToUri.nkod);

/**
 * Add a prefix with its namespace to the lookup table. Used in logging and provenance.
 * @param prefix short-hand alias for the namespace (i.e. 'dcat').
 * @param uri full uri of the namespace (i.e. 'http://www.w3.org/ns/dcat#').
 * @returns true if prefix was added, false if it was already present (or conflicting).
 */
export function addPrefix(prefix: string, uri: string): boolean {
    if (prefix in prefixToUri) {
        if (prefixToUri[prefix] !== uri)
            logger.error(`Prefix ${prefix} already exists with different URI ${prefixToUri[prefix]} and ${uri}.`);
        return false;
    }

    prefixToUri[prefix] = uri;
    prefixToNamespace[prefix] = Util.prefix(uri);
    uriToPrefix[uri] = prefix;
    return true;
}


/** https://dbpedia.org/ontology/filename */
export const fileName = dbo('filename');
/** https://dbpedia.org/ontology/file */
export const file = dbo('file');

export const Statement = rdf('Statement');
export const Property = rdf('Property');
export const hasSubject = rdf('subject');
export const hasPredicate = rdf('predicate');
export const hasObject = rdf('object');

/** https://www.w3.org/2000/01/rdf-schema#type */
export const type = rdfs('type');
/** https://www.w3.org/2000/01/rdf-schema#type */
export const isA = rdfs('type');
/** https://www.w3.org/2000/01/rdf-schema#resource */
export const resource = rdfs('resource');

/** http://www.w3.org/ns/prov#Entity */
export const ProvenanceEntity = prov('Entity');
export const wasDerivedFrom = prov('wasDerivedFrom');
export const wasGeneratedBy = prov('wasGeneratedBy');

/** http://purl.org/dc/terms/title */
export const title = dcterms('title');
/** http://purl.org/dc/terms/description */
export const description = dcterms('description');
/** http://purl.org/dc/terms/created */
export const created = dcterms('created');
/** http://purl.org/dc/terms/modified */
export const modified = dcterms('modified');

/** http://www.w3.org/2001/XMLSchema#dateTime */
export const dateTimeType = xsd('dateTime');
/** http://www.w3.org/2001/XMLSchema#date */
export const dateType = xsd('date');

/** http://www.w3.org/ns/csvw#schema */
export const csvSchema = csvw('schema');
/** http://www.w3.org/ns/csvw#TableSchema */
export const csvTableSchema = csvw('TableSchema');
/** http://www.w3.org/ns/csvw#name */
export const csvColumnName = csvw('name');
/** http://www.w3.org/ns/csvw#datatype */
export const csvColumnDatatype = csvw('datatype');
/** http://www.w3.org/ns/csvw#required */
export const csvColumnRequired = csvw('required');
/** http://www.w3.org/ns/csvw#unique */
export const csvColumnUnique = csvw('unique');
/** http://www.w3.org/ns/csvw#enum */
export const csvColumnEnum = csvw('enum');

/** http://www.w3.org/ns/dcat#Catalog */
export const catalog = dcat('Catalog');
/** http://www.w3.org/ns/dcat#DatasetSeries */
export const datasetSeries = dcat('DatasetSeries');
/** http://www.w3.org/ns/dcat#Dataset */
export const DataSet = dcat('Dataset');
/** http://www.w3.org/ns/dcat#dataset */
export const dataSet = dcat('dataset');
/** http://www.w3.org/ns/dcat#theme */
export const theme = dcat('theme');
/** http://www.w3.org/ns/dcat#keyword */
export const keyword = dcat('keyword');
/** http://www.w3.org/ns/dcat#startDate */
export const startDate = dcat('startDate');
/** http://www.w3.org/ns/dcat#endDate */
export const endDate = dcat('endDate');
/** http://www.w3.org/ns/dcat#inSeries */
export const inSeries = dcat('inSeries');
/** http://www.w3.org/ns/dcat#contactPoint */
export const contactPoint = dcat('contactPoint');
/** http://www.w3.org/ns/dcat#spatialResolutionInMeters */
export const spatialResolutionInMeters = dcat('spatialResolutionInMeters');
/** http://www.w3.org/ns/dcat#temporalResolution */
export const temporalResolution = dcat('temporalResolution');
/** http://www.w3.org/ns/dcat#Distribution */
export const Distribution = dcat('Distribution');
/** http://www.w3.org/ns/dcat#distribution */
export const hasDistribution = dcat('distribution');
/** http://www.w3.org/ns/dcat#accessURL */
export const accessURL = dcat('accessURL');
/** http://www.w3.org/ns/dcat#downloadURL */
export const downloadURL = dcat('downloadURL');
/** http://www.w3.org/ns/dcat#mediaType */
export const mediaType = dcat('mediaType');
/** http://www.w3.org/ns/dcat#compressFormat */
export const compressFormat = dcat('compressFormat');
/** http://www.w3.org/ns/dcat#packageFormat */
export const packageFormat = dcat('packageFormat');
/** http://www.w3.org/ns/dcat#accessService */
export const accessService = dcat('accessService');
/** http://www.w3.org/ns/dcat#DataService */
export const dataService = dcat('DataService');
/** http://www.w3.org/ns/dcat#endpointURL */
export const endpointURL = dcat('endpointURL');
/** http://www.w3.org/ns/dcat#endpointDescription */
export const endpointDescription = dcat('endpointDescription');
/** http://www.w3.org/ns/dcat#servesDataset */
export const servesDataset = dcat('servesDataset');

/** http://data.europa.eu/r5r/applicableLegislation */
export const applicableLegislation = dcatAp('applicableLegislation');
/** http://data.europa.eu/r5r/hvdCategory */
export const hvdCategory = dcatAp('hvdCategory');

/** http://purl.org/dc/terms/publisher */
export const publisher = dcterms('publisher');
/** http://purl.org/dc/terms/accrualPeriodicity */
export const accrualPeriodicity = dcterms('accrualPeriodicity');
/** http://purl.org/dc/terms/spatial */
export const spatial = dcterms('spatial');
/** http://purl.org/dc/terms/temporal */
export const temporal = dcterms('temporal');
/** http://purl.org/dc/terms/PeriodOfTime */
export const PeriodOfTime = dcterms('PeriodOfTime');
/** http://purl.org/dc/terms/conformsTo */
export const conformsTo = dcterms('conformsTo');
/** http://purl.org/dc/terms/format */
export const format = dcterms('format');

/** http://xmlns.com/foaf/0.1/homepage */
export const homepage = foaf('homepage');
/** http://xmlns.com/foaf/0.1/page */
export const page = foaf('page');

/** https://data.gov.cz/slovník/podmínky-užití/specifikace */
export const specifikace = pu('specifikace');
/** https://data.gov.cz/slovník/podmínky-užití/autorské-dílo */
export const autorskeDilo = pu('autorské-dílo');
/** https://data.gov.cz/slovník/podmínky-užití/autor */
export const autor = pu('autor');
/** https://data.gov.cz/slovník/podmínky-užití/databáze-jako-autorské-dílo */
export const databazeJakoAutorskeDilo = pu('databáze-jako-autorské-dílo');
/** https://data.gov.cz/slovník/podmínky-užití/autor-databáze */
export const autorDatabaze = pu('autor-databáze');
/** https://data.gov.cz/slovník/podmínky-užití/databáze-chráněná-zvláštními-právy */
export const databaseChranenaZvlastnimiPracy = pu('databáze-chráněná-zvláštními-právy');
/** https://data.gov.cz/slovník/podmínky-užití/osobní-údaje */
export const osobniUdaje = pu('osobní-údaje');

/** http://www.w3.org/2006/vcard/ns#Organization */
export const organization = vcard('Organization');
/** http://www.w3.org/2006/vcard/ns#fn */
export const fn = vcard('fn');
/** http://www.w3.org/2006/vcard/ns#hasEmail */
export const hasEmail = vcard('hasEmail');
