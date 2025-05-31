import { DataFactory, Literal, NamedNode, Term } from 'n3';
import literal = DataFactory.literal;
import { dateTimeType, dateType, uriToPrefix } from './vocabulary';
import { logger } from '../logger';

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

    if (uri.endsWith('/'))
        uri = uri.substring(0, uri.length - 1);

    const hashIndex = uri.lastIndexOf('#');
    const slashIndex = uri.lastIndexOf('/');
    const splitIndex = Math.max(hashIndex, slashIndex);

    return [uri.substring(0, splitIndex + 1), uri.substring(splitIndex + 1)]
}

export function getNamespace(node: NamedNode): string {
    return splitUri(node)[0];
}

export function getLocalName(node: NamedNode): string {
    return splitUri(node)[1];
}

export function getCompactName(node?: Term | null): string {
    if (!node)
        return 'null';

    switch(node.termType) {
        case 'NamedNode':
            const [namespace, localName] = splitUri(node);
            const prefix = uriToPrefix[namespace];
            if (!prefix) {
                logger.warn(`No prefix defined for ${node.value}. Consider adding it via vocabulary/addPrefix(prefix, uri).`);
                return node.value;
            }
            return prefix + ':' + localName;
        case 'BlankNode':
            return '_:' + node.value;
        default:
            return node.value;
    }

}
