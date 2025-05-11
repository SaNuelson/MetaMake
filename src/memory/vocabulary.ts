import { Util } from 'n3';

import prefix = Util.prefix;

const dbo = prefix('https://dbpedia.org/ontology/');
/** https://dbpedia.org/ontology/filename */
export const fileName = dbo('filename');
/** https://dbpedia.org/ontology/file */
export const file = dbo('file');

const rdfs = prefix('https://www.w3.org/TR/rdf-schema/#');
/** https://www.w3.org/TR/rdf-schema/#type */
export const type = rdfs('type');
/** https://www.w3.org/TR/rdf-schema/#type */
export const isA = rdfs('type');
/** https://www.w3.org/TR/rdf-schema/#resource */
export const resource = rdfs('resource');

const dct = prefix('http://purl.org/dc/terms/');
/** http://purl.org/dc/terms/title */
export const title = dct('title');
/** http://purl.org/dc/terms/description */
export const description = dct('description');
/** http://purl.org/dc/terms/created */
export const created = dct('created');
/** http://purl.org/dc/terms/modified */
export const modified = dct('modified');

const xsd = prefix('http://www.w3.org/2001/XMLSchema#');
/** http://www.w3.org/2001/XMLSchema#dateTime */
export const dateTimeType = xsd('dateTime');
/** http://www.w3.org/2001/XMLSchema#date */
export const dateType = xsd('date');

const csvw = prefix('http://www.w3.org/ns/csvw#');
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

export const mm = prefix('http://tempuri.org/metamake/');

export const adms = prefix('http://www.w3.org/ns/adms#');

export const dcat = prefix('http://www.w3.org/ns/dcat#');
/** http://www.w3.org/ns/dcat#Catalog */
export const catalog = dcat('Catalog');
/** http://www.w3.org/ns/dcat#DatasetSeries */
export const datasetSeries = dcat('DatasetSeries');
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
export const distribution = dcat('Distribution');
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

export const dcatAp = prefix('http://data.europa.eu/r5r/');
/** http://data.europa.eu/r5r/applicableLegislation */
export const applicableLegislation = dcatAp('applicableLegislation');
/** http://data.europa.eu/r5r/hvdCategory */
export const hvdCategory = dcatAp('hvdCategory');

export const dcterms = prefix('http://purl.org/dc/terms/');
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

export const foaf = prefix('http://xmlns.com/foaf/0.1/');
/** http://xmlns.com/foaf/0.1/homepage */
export const homepage = foaf('homepage');
/** http://xmlns.com/foaf/0.1/page */
export const page = foaf('page');

export const location = prefix('http://www.w3.org/ns/locn#');

export const odrl = prefix('http://www.w3.org/ns/odrl/2/');

export const prov = prefix('http://www.w3.org/ns/prov#');

export const pu = prefix('https://data.gov.cz/slovník/podmínky-užití/');
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

export const skos = prefix('http://www.w3.org/2004/02/skos/core#');

export const spdx = prefix('http://spdx.org/rdf/terms#');

export const time = prefix('http://www.w3.org/2006/time#');

export const vcard = prefix('http://www.w3.org/2006/vcard/ns#');
/** http://www.w3.org/2006/vcard/ns#Organization */
export const organization = vcard('Organization');
/** http://www.w3.org/2006/vcard/ns#fn */
export const fn = vcard('fn');
/** http://www.w3.org/2006/vcard/ns#hasEmail */
export const hasEmail = vcard('hasEmail');

export const nkod = prefix('https://data.gov.cz/slovník/nkod/');
