import { NumberUseType, recognizeNumbers } from '../parse.num';


describe('NumberUseType Recognition', () => {

    it('should correctly recognize a list of integers', () => {
        const input = [1, 2, 3, 4, 5].map(String);
        const output = recognizeNumbers(input, {});

        expect(output.length).toBe(1);
        const useType = output[0];

        expect(useType.integral).toBe(true);
        expect(useType.min).toBe(1);
        expect(useType.max).toBe(5);
    });


    it('should correctly recognize a list of floats', () => {
        const input = [1.1, 2.2, 3.3, 4.4, 5.5].map(String);
        const output = recognizeNumbers(input, {});

        expect(output.length).toBe(1);
        const useType = output[0];

        expect(useType.integral).toBe(false);
        expect(useType.min).toBe(1.1);
        expect(useType.max).toBe(5.5);
    });


    it('should correctly recognize a list of scientific numbers', () => {
        const input = ['1e2', '2.2e3', '3.33e4', '4.444e5', '5.5555e6'].map(String);
        const output = recognizeNumbers(input, {});

        expect(output.length).toBe(1);
        const useType = output[0];

        expect(useType.integral).toBe(true);
        expect(useType.scientific).toBe(true);
        expect(useType.min).toBe(1e2);
        expect(useType.max).toBe(5.5555e6);
    });


    it('should correctly recognize a list of numbers using thousands separators', () => {
        const input = ['1,000', '2,000', '3,000', '4,000', '5,000'].map(String);
        const output = recognizeNumbers(input, {});

        expect(output.length).toBe(1);
        const useType = output[0];

        expect(useType.integral).toBe(true);
        expect(useType.thousandSeparator).toBe(',');
        expect(useType.min).toBe(1000);
        expect(useType.max).toBe(5000);
    });


    it('should correctly recognize a list of price tags with a dollar sign prefix', () => {
        const input = ['$100', '$200', '$300', '$400', '$500'].map(String);
        const output = recognizeNumbers(input, {});

        expect(output.length).toBe(1);
        const useType = output[0];

        expect(useType.integral).toBe(true);
        expect(useType.prefixes).toBe(['$']);
        expect(useType.min).toBe(100);
        expect(useType.max).toBe(500);
    });


    it('should not recognize a list of numbers intertwined with non-numeric strings', () => {
        const input = ['1', 'two', '3', 'four', '5', 'six'].map(String);
        const output = recognizeNumbers(input, {});

        expect(output.length).toBe(0);
    });
});

describe('Format', () => {
    it('should correctly format the input', () => {

    });
});

describe('Deformat', () => {
    it('should correctly deformat the formatted input', () => {

    });
});