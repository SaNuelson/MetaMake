import { Util } from 'n3';


import prefix = Util.prefix;

const dboPrefix = prefix('https://dbpedia.org/ontology/');
export const fileName = dboPrefix('filename');
export const file = dboPrefix('file');

const rdfsPrefix = prefix('https://www.w3.org/TR/rdf-schema/#');
export const type = rdfsPrefix('type');
export const isA = rdfsPrefix('type');
export const resource = rdfsPrefix('resource');

const dctPrefix = prefix('http://purl.org/dc/terms/');
export const title = dctPrefix('title');
export const description = dctPrefix('description');
export const created = dctPrefix('created');
export const modified = dctPrefix('modified');

const xsdPrefix = prefix('http://www.w3.org/2001/XMLSchema#');
export const dateTimeType = xsdPrefix('dateTime');
export const dateType = xsdPrefix('date');

export const mmPrefix = prefix('http://tempuri.org/metamake/');

export const admsPrefix = prefix('http://www.w3.org/ns/adms#');

export const dcatPrefix = prefix('http://www.w3.org/ns/dcat#');
export const catalog = dcatPrefix('Catalog');
export const datasetSeries = dcatPrefix('DatasetSeries');
export const dataSet = dcatPrefix('dataset');
export const theme = dcatPrefix('theme');
export const keyword = dcatPrefix('keyword');
export const startDate = dcatPrefix('startDate');
export const endDate = dcatPrefix('endDate');
export const inSeries = dcatPrefix('inSeries');
export const contactPoint = dcatPrefix('contactPoint');
export const spatialResolutionInMeters = dcatPrefix('spatialResolutionInMeters');
export const temporalResolution = dcatPrefix('temporalResolution');
export const distribution = dcatPrefix('distribution');
export const accessURL = dcatPrefix('accessURL');
export const downloadURL = dcatPrefix('downloadURL');
export const mediaType = dcatPrefix('mediaType');
export const compressFormat = dcatPrefix('compressFormat');
export const packageFormat = dcatPrefix('packageFormat');
export const accessService = dcatPrefix('accessService');
export const dataService = dcatPrefix('DataService');
export const endpointURL = dcatPrefix('endpointURL');
export const endpointDescription = dcatPrefix('endpointDescription');
export const servesDataset = dcatPrefix('servesDataset');

export const dcatApPrefix = prefix('http://data.europa.eu/r5r/');
export const applicableLegislation = dcatApPrefix('applicableLegislation');
export const hvdCategory = dcatApPrefix('hvdCategory');

export const dctermsPrefix = prefix('http://purl.org/dc/terms/');
export const publisher = dctermsPrefix('publisher');
export const accrualPeriodicity = dctermsPrefix('accrualPeriodicity');
export const spatial = dctermsPrefix('spatial');
export const temporal = dctermsPrefix('temporal');
export const PeriodOfTime = dctermsPrefix('PeriodOfTime');
export const conformsTo = dctermsPrefix('conformsTo');
export const format = dctermsPrefix('format');

export const foafPrefix = prefix('http://xmlns.com/foaf/0.1/');
export const homepage = foafPrefix('homepage');
export const page = foafPrefix('page');

export const locationPrefix = prefix('http://www.w3.org/ns/locn#');

export const odrlPrefix = prefix('http://www.w3.org/ns/odrl/2/');

export const provPrefix = prefix('http://www.w3.org/ns/prov#');

export const puPrefix = prefix('https://data.gov.cz/slovník/podmínky-užití/');
export const specifikace = puPrefix('specifikace');
export const autorskeDilo = puPrefix('autorské-dílo');
export const autor = puPrefix('autor');
export const databazeJakoAutorskeDilo = puPrefix('databáze-jako-autorské-dílo');
export const autorDatabaze = puPrefix('autor-databáze');
export const databaseChranenaZvlastnimiPracy = puPrefix('databáze-chráněná-zvláštními-právy');
export const osobniUdaje = puPrefix('osobní-údaje');

export const skosPrefix = prefix('http://www.w3.org/2004/02/skos/core#');

export const spdxPrefix = prefix('http://spdx.org/rdf/terms#');

export const timePrefix = prefix('http://www.w3.org/2006/time#');

export const vcardPrefix = prefix('http://www.w3.org/2006/vcard/ns#');
export const organization = vcardPrefix('Organization');
export const fn = vcardPrefix('fn');
export const hasEmail = vcardPrefix('hasEmail');

export const nkodPrefix = prefix('https://data.gov.cz/slovník/nkod/');
