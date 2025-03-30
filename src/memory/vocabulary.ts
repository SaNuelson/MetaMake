import { Util } from 'n3';


import prefix = Util.prefix;

const dbo = prefix('https://dbpedia.org/ontology/');

export const fileName = dbo('filename');
export const file = dbo('file');

const rdfs = prefix('https://www.w3.org/TR/rdf-schema/#');

export const type = rdfs('type');
export const isA = type;
export const resource = rdfs('resource');

const dct = prefix('https://www.dublincore.org/specifications/dublin-core/dcmi-terms/#');

export const title = dct('title');
export const description = dct('description');
export const created = dct('created');
export const modified = dct('modified');

const xsd = prefix('http://www.w3.org/2001/XMLSchema#');

export const dateTimeType = xsd('dateTime');
export const dateType = xsd('date');

export const mm = prefix('http://metamake.com/');
