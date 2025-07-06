import { NamedNode } from 'n3';
import { getCompactName, splitUri } from '../utils.js';
import { DataSet, title } from '../vocabulary.js';


describe('getCompactName', () => {
    test('should compact DCT URI to prefix form', () => {
        expect(getCompactName(title)).toBe('dcterms:title');
    });

    test('should compact RDF URI to prefix form', () => {
        expect(getCompactName(DataSet)).toBe('dcat:Dataset');
    });
});

describe('splitUri', () => {
    test('should split simple URI using hashtag', () => {
        const node = new NamedNode('http://example.org/vocabulary#test');

        expect(splitUri(node)).toEqual(['http://example.org/vocabulary#', 'test']);
    });

    test('should split URI using front-slash', () => {
        const node = new NamedNode('http://example.org/path/to/resource');

        expect(splitUri(node)).toEqual(['http://example.org/path/to/', 'resource']);
    });
});
