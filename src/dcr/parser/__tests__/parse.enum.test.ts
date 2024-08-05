import { Enum, recognizeEnums } from '../parse.enum';

describe('parse.enum', () => {

    test('does not recognize ID column', () => {
        const input = ['1', '2', '3', '5', '6', '10', '12', '13', '14', '20', '23', '30'];

        const result = recognizeEnums(input, {});

        expect(result).toEqual([]);
    })

    test('does recognize categorical column', () => {
        const input = ['male', 'female', 'nonbinary', 'unknown', 'female', 'male', 'unknown', 'nonbinary', 'male', 'unknown'];

        const result = recognizeEnums(input, {});

        expect(result).toHaveLength(1);
        expect(result[0].domain).toHaveLength(4);
    })

    test('does not recognize enumeration when the only repeating item is potentially a null value', () => {
        const input = ['RAM', 'CPU', 'SSD', 'CPU', 'Motherboard', 'CPU', 'HDD', 'CPU', 'Power Supply', 'CPU', 'CPU'];

        const result = recognizeEnums(input, {});

        expect(result).toEqual([]);
    });
})

describe('EnumUseType', () => {
    test('formats items properly', () => {
        const enumUseType = new Enum({
            domain:
                [
                    'Gryffindor',
                    'Hufflepuff',
                    'Ravenclaw',
                    'Slytherin',
                ]
        }, {})

        const input_values = ['Gryffindor', 'Something', 'Hufflepuff', 'AgainSomething'];
        const expected_output = ['Gryffindor', undefined, 'Hufflepuff', undefined];

        // iterate through test values and check the result
        for (let i = 0; i < input_values.length; i++) {
            expect(enumUseType.format(input_values[i])).toEqual(expected_output[i]);
        }
    })

    test('deformats items properly', () => {
        const enumUseType = new Enum({
            domain:
                [
                    'Gryffindor',
                    'Hufflepuff',
                    'Ravenclaw',
                    'Slytherin',
                ],
        }, {});

        const input_values = ['Gryffindor', 'Something', 'Hufflepuff', 'AgainSomething'];
        const expected_output = ['Gryffindor', undefined, 'Hufflepuff', undefined];

        // iterate through test values and check the result
        for (let i = 0; i < input_values.length; i++) {
            expect(enumUseType.deformat(input_values[i])).toEqual(expected_output[i]);
        }
    });
})