import { NamedNode, PrefixedToIri, Util, Writer } from 'n3';

import { logger } from '../logger';

/**
 * Mapping of prefixes to their namespace URIs.
 * @example prefixToUri['dcat'] === 'http://www.w3.org/ns/dcat#'
 */
export const prefixToUri: {[prefix: string]: string;} = {
    adms: 'http://www.w3.org/ns/adms#',
    csvw: 'http://www.w3.org/ns/csvw#',
    dbo: 'https://dbpedia.org/ontology/',
    dcat: 'http://www.w3.org/ns/dcat#',
    dcatAp: 'http://data.europa.eu/r5r/',
    dct: 'http://purl.org/dc/terms/',
    foaf: 'http://xmlns.com/foaf/0.1/',
    media: 'https://www.iana.org/assignments/media-types/',
    location: 'http://www.w3.org/ns/locn#',
    media: 'https://www.iana.org/assignments/media-types/',
    mm: 'http://tempuri.org/metamake/',
    nkod: 'https://data.gov.cz/slovník/nkod/',
    odrl: 'http://www.w3.org/ns/odrl/2/',
    prov: 'http://www.w3.org/ns/prov#',
    pu: 'https://data.gov.cz/slovník/podmínky-užití/',
    rdf: 'https://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfs: 'https://www.w3.org/2000/01/rdf-schema#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    spdx: 'http://spdx.or;g/rdf/terms#',
    time: 'http://www.w3.org/2006/time#',
    vcard: 'http://www.w3.org/2006/vcard/ns#',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
} as const;

/**
 * Mapping of prefixes to a function turning local names into named nodes.
 * @example prefixToNamespace['dcat']('dataset') === new NamedNode('http://www.w3.org/ns/dcat#dataset')
 */
export const prefixToNamespace: { [prefix: string]: (localName: string) => NamedNode } = Object.fromEntries(
    Object.entries(prefixToUri).map(([p, uri]) => [p, Util.prefix(uri)])
);

/**
 * Mapping of URIs to their commonly used namespace prefixes.
 * @example uriToPrefix['http://www.w3.org/ns/dcat#'] === 'dcat'
 */
export const uriToPrefix = Object.fromEntries(
    Object.entries(prefixToUri).map(([p, uri]) => [uri, p])
);

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

//#region dbo
export const fileName = prefixToNamespace.dbo('filename');
export const file = prefixToNamespace.dbo('file');
//#endregion

//#region rdf
export const Statement = prefixToNamespace.rdf('Statement');
export const Property = prefixToNamespace.rdf('Property');
export const hasSubject = prefixToNamespace.rdf('subject');
export const hasPredicate = prefixToNamespace.rdf('predicate');
export const hasObject = prefixToNamespace.rdf('object');
//#endregion

//#region rdfs
export const type = prefixToNamespace.rdfs('type');
export const isA = prefixToNamespace.rdfs('type');
export const resource = prefixToNamespace.rdfs('resource');
//#endregion

//#region prov
export const ProvenanceEntity = prefixToNamespace.prov('Entity');
export const wasDerivedFrom = prefixToNamespace.prov('wasDerivedFrom');
export const wasGeneratedBy = prefixToNamespace.prov('wasGeneratedBy');
//#endregion

//#region dct
export const title = prefixToNamespace.dct('title');
export const description = prefixToNamespace.dct('description');
export const created = prefixToNamespace.dct('created');
export const modified = prefixToNamespace.dct('modified');
export const publisher = prefixToNamespace.dct('publisher');
export const accrualPeriodicity = prefixToNamespace.dct('accrualPeriodicity');
export const spatial = prefixToNamespace.dct('spatial');
export const temporal = prefixToNamespace.dct('temporal');
export const PeriodOfTime = prefixToNamespace.dct('PeriodOfTime');
export const conformsTo = prefixToNamespace.dct('conformsTo');
export const format = prefixToNamespace.dct('format');
//#endregion

//#region xsd
export const dateTimeType = prefixToNamespace.xsd('dateTime');
export const dateType = prefixToNamespace.xsd('date');
//#endregion

//#region media
export const CsvMediaType = prefixToNamespace.media('text/csv');
export const JsonMediaType = prefixToNamespace.media('application/json');
export const XmlMediaType = prefixToNamespace.media('application/xml');
export const RdfMediaType = prefixToNamespace.media('application/rdf+xml');
export const TurtleMediaType = prefixToNamespace.media('text/turtle');
export const N3MediaType = prefixToNamespace.media('text/n3');
//#endregion

//#region csvw
export const csvSchema = prefixToNamespace.csvw('schema');
export const csvTableSchema = prefixToNamespace.csvw('TableSchema');
export const csvColumnName = prefixToNamespace.csvw('name');
export const csvColumnDatatype = prefixToNamespace.csvw('datatype');
export const csvColumnRequired = prefixToNamespace.csvw('required');
export const csvColumnUnique = prefixToNamespace.csvw('unique');
export const csvColumnEnum = prefixToNamespace.csvw('enum');
//#endregion

//#region dcat
export const catalog = prefixToNamespace.dcat('Catalog');
export const datasetSeries = prefixToNamespace.dcat('DatasetSeries');
export const DataSet = prefixToNamespace.dcat('Dataset');
export const dataSet = prefixToNamespace.dcat('dataset');
export const theme = prefixToNamespace.dcat('theme');
export const keyword = prefixToNamespace.dcat('keyword');
export const startDate = prefixToNamespace.dcat('startDate');
export const endDate = prefixToNamespace.dcat('endDate');
export const inSeries = prefixToNamespace.dcat('inSeries');
export const contactPoint = prefixToNamespace.dcat('contactPoint');
export const spatialResolutionInMeters = prefixToNamespace.dcat('spatialResolutionInMeters');
export const temporalResolution = prefixToNamespace.dcat('temporalResolution');
export const Distribution = prefixToNamespace.dcat('Distribution');
export const hasDistribution = prefixToNamespace.dcat('distribution');
export const accessURL = prefixToNamespace.dcat('accessURL');
export const downloadURL = prefixToNamespace.dcat('downloadURL');
export const mediaType = prefixToNamespace.dcat('mediaType');
export const compressFormat = prefixToNamespace.dcat('compressFormat');
export const packageFormat = prefixToNamespace.dcat('packageFormat');
export const accessService = prefixToNamespace.dcat('accessService');
export const dataService = prefixToNamespace.dcat('DataService');
export const endpointURL = prefixToNamespace.dcat('endpointURL');
export const endpointDescription = prefixToNamespace.dcat('endpointDescription');
export const servesDataset = prefixToNamespace.dcat('servesDataset');
//#endregion

//#region dcat-ap
export const applicableLegislation = prefixToNamespace.dcatAp('applicableLegislation');
export const hvdCategory = prefixToNamespace.dcatAp('hvdCategory');
//#endregion

//#region foaf
export const homepage = prefixToNamespace.foaf('homepage');
export const page = prefixToNamespace.foaf('page');
//#endregion

//#region pu
export const specifikace = prefixToNamespace.pu('specifikace');
export const autorskeDilo = prefixToNamespace.pu('autorské-dílo');
export const autor = prefixToNamespace.pu('autor');
export const databazeJakoAutorskeDilo = prefixToNamespace.pu('databáze-jako-autorské-dílo');
export const autorDatabaze = prefixToNamespace.pu('autor-databáze');
export const databaseChranenaZvlastnimiPracy = prefixToNamespace.pu('databáze-chráněná-zvláštními-právy');
export const osobniUdaje = prefixToNamespace.pu('osobní-údaje');
//#endregion

//#region vcard
export const organization = prefixToNamespace.vcard('Organization');
export const fn = prefixToNamespace.vcard('fn');
export const hasEmail = prefixToNamespace.vcard('hasEmail');
//#endregion

//#region mm
export const PrimaryDistribution = prefixToNamespace.mm('PrimaryDistribution');
//#endregion
