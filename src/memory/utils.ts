import { BlankNode, DataFactory, DefaultGraph, Literal, NamedNode, Quad, Term, Util, Variable } from 'n3';
import { getScopedLogger } from '../logger.js';
import { dateTimeType, dateType, uriToPrefix } from './vocabulary.js';
import literal = DataFactory.literal;

const logger = getScopedLogger('Memory');

const dateFormatter = new Intl.DateTimeFormat('en', {year: 'numeric', month: '2-digit', day: '2-digit'});

export function dateLiteral(date: Date): Literal {
    const formattedDate = dateFormatter.format(date).replaceAll('/', '-');
    return literal(formattedDate, dateType);
}

export function dateTimeLiteral(dateTime: Date): Literal {
    const formattedDateTime = dateTime.toISOString();
    return literal(formattedDateTime, dateTimeType);
}

export function splitUri(node: NamedNode): string[] {
    let uri = node.value;

    for (const prefix in uriToPrefix) {
        if (uri.startsWith(prefix)) {
            return [uri.substring(0, prefix.length), uri.substring(prefix.length)];
        }
    }

    if (uri.endsWith('/')) uri = uri.substring(0, uri.length - 1);

    const hashIndex = uri.lastIndexOf('#');
    const slashIndex = uri.lastIndexOf('/');
    const splitIndex = Math.max(hashIndex, slashIndex);

    return [uri.substring(0, splitIndex + 1), uri.substring(splitIndex + 1)];
}

export function getNamespace(node: NamedNode): string {
    return splitUri(node)[0];
}

export function getLocalName(node: NamedNode): string {
    return splitUri(node)[1];
}

export function getCompactName(node?: Quad | Term | null): string {
    if (!node) {
        return null;
    }

    if (node instanceof Quad) {
        return [node.subject, node.predicate, node.object, node.graph]
            .map(n => getCompactName(n)).join(' ');
    }

    switch (node.termType) {
        case 'NamedNode': {
            const [namespace, localName] = splitUri(node);
            const prefix = uriToPrefix[namespace];
            if (!prefix) {
                logger.warn(`No prefix defined for ${node.value}. Consider adding it via vocabulary/addPrefix(prefix, uri).`);
                return node.value;
            }
            return prefix + ':' + localName;
        }
        case 'BlankNode':
            return '_:' + node.value;
        default:
            return node.value;
    }

}


export function isNamedNode(value: Term | null): value is NamedNode {
    if (value instanceof Quad) return false;
    return Util.isNamedNode(value);
}

export function isBlankNode(value: Term | null): value is BlankNode {
    if (value instanceof Quad) return false;
    return Util.isBlankNode(value);
}

export function isLiteral(value: Term | null): value is Literal {
    if (value instanceof Quad) return false;
    return Util.isLiteral(value);
}

export function isVariable(value: Term | null): value is Variable {
    if (value instanceof Quad) return false;
    return Util.isVariable(value);
}

export function isDefaultGraph(value: Term | null): value is DefaultGraph {
    if (value instanceof Quad) return false;
    return Util.isDefaultGraph(value);
}
