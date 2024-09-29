import { DataFactory, Literal } from 'n3';
import literal = DataFactory.literal;
import { dateTimeType, dateType } from './vocabulary';

const dateFormatter = new Intl.DateTimeFormat('en', {year: 'numeric', month: '2-digit', day: '2-digit'});

export function dateLiteral(date: Date): Literal {
    const formattedDate = dateFormatter.format(date).replaceAll('/', '-');
    return literal(formattedDate, dateType);
}

export function dateTimeLiteral(dateTime: Date): Literal {
    const formattedDateTime = dateTime.toISOString();
    return literal(formattedDateTime, dateTimeType);
}