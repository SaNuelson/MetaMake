import { recognizeTimestamps } from '../recognize';
import { Timestamp } from '../useType';

describe('recognizeTimestamps', () => {
    it('should correctly recognize a timestamp format of a list of UTC timestamps', () => {
        const timestampsUTC = ['2022-02-13T02:45:00Z', '2023-05-15T18:30:00Z', '2024-10-01T12:30:20Z'];

        const expectedFormatting = ['{YYYY}', '-', '{MM}', '-', '{DD}', 'T', '{hh}', ':', '{mm}', ':', '{ss}', 'Z'];
        const resultUTC = recognizeTimestamps(timestampsUTC, {});

        expect(resultUTC.length).toBeGreaterThanOrEqual(1);
        expect(resultUTC.some(item => item.formatting.toString() === expectedFormatting.toString())).toBeTruthy();
    });


    it('should correctly recognize a format of a list of simple dates', () => {
        const simpleDates = ['2024-10-01', '2022-02-14', '2021-12-01'];

        const expectedFormatting = ['{YYYY}', '-', '{MM}', '-', '{DD}'];
        const result = recognizeTimestamps(simpleDates, {});

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(item => item.formatting.toString() === expectedFormatting.toString())).toBeTruthy();
    });


    it('should correctly recognize a format of a list of simple dates with written out months', () => {
        const simpleDatesWithMonthsWritten = ['October 1, 2024', 'February 14, 2022', 'December 1, 2021'];

        const expectedFormatting = ['{MMMM}', ' ', '{D}', ', ', '{YYYY}'];
        const result = recognizeTimestamps(simpleDatesWithMonthsWritten, {});

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(item => item.formatting.toString() === expectedFormatting.toString())).toBeTruthy();
    });


    it('should correctly recognize a format of a list of timestamps without date', () => {
        const timeStamps = ['13:45:00', '18:30:00', '12:30:20'];

        const expectedFormatting = ['{hh}', ':', '{mm}', ':', '{ss}'];
        const result = recognizeTimestamps(timeStamps, {});

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(item => item.formatting.toString() === expectedFormatting.toString())).toBeTruthy();
    });


    it('should correctly recognize a format of minutes, seconds, and milliseconds', () => {
        const timeStamps = ['01:10.045', '10:23.456', '44:00.567'];

        const expectedFormatting = ['{mm}', ':', '{ss}', '.', '{nnn}'];
        const result = recognizeTimestamps(timeStamps, {});

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(item => item.formatting.toString() === expectedFormatting.toString())).toBeTruthy();
    });

    it('should correctly recognize a format of dates with missing values', () => {
        const timeStamps = [
            '2015-11-01',
            '2015-10-13',
            '2005-08-17',
            '2000-10-17',
            '2006-04-27',
            '2013-05-21',
            '2019-07-31',
            '',
            '2019-10-23',
            '2021-06-24',
            '2021-07-16',
            '2019-07-26',
        ];

        const expectedFormatting = ['{YYYY}','-','{MM}','-','{DD}']
        const result = recognizeTimestamps(timeStamps, {hasNull:true, nullVal:''});

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(item => item.formatting.toString() === expectedFormatting.toString())).toBeTruthy();
    })

    it('should correctly recognize a format of dates with missing values in the initial batch', () => {
        const timeStamps = [
            '2015-11-01',
            '2015-10-13',
            '',
            '2005-08-17',
            '2000-10-17',
            '2006-04-27',
            '2013-05-21',
            '2019-07-31',
            '2019-10-23',
            '2021-06-24',
            '2021-07-16',
            '2019-07-26',
        ];

        const expectedFormatting = ['{YYYY}','-','{MM}','-','{DD}']
        const result = recognizeTimestamps(timeStamps, {hasNull:true, nullVal:''});

        expect(result.length).toBeGreaterThanOrEqual(1);
        expect(result.some(item => item.formatting.toString() === expectedFormatting.toString())).toBeTruthy();
    })
})


describe('Timestamp.deformat', () => {
    it('should correctly deformat a timestamp', () => {
        const timestamp = new Timestamp({
            formatting: ['{YYYY}','-','{MM}','-','{DD}']
        }, {});

        const expected = new Date('1998-05-02');
        const result = <Date>timestamp.deformat('1998-05-02');

        expect(result).toEqual(expected);
    });
});
