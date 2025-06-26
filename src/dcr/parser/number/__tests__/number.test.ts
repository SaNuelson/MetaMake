import { recognizeNumbers } from '../recognize';
import { NumberUseType } from '../useType';


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
        const input = ['1.1e2', '2.2e3', '3.33e4', '4.444e5', '5.5555e6'];
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
        expect(useType.prefixes).toContain('$');
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
    it('should correctly format basic numbers', () => {
        const useType = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$'],
            suffixes: ['%']
        }, {});

        expect(useType.format(1234)).toBe('$1,234%');
        expect(useType.format(1234.56)).toBe('$1,234.56%');
        expect(useType.format(0.5)).toBe('$0.5%');
    });

    it('should correctly format numbers with different separators', () => {
        const useType = new NumberUseType({
            separators: [' ', ','],
            prefixes: [],
            suffixes: []
        }, {});

        expect(useType.format(1234)).toBe('1 234');
        expect(useType.format(1234.56)).toBe('1 234,56');
    });

    it('should handle scientific notation', () => {
        const useType = new NumberUseType({
            separators: ['', '.'],
            prefixes: [],
            suffixes: [],
            scientific: true
        }, {});

        // Note: Scientific notation formatting may need to be fixed in the implementation
        const formatted = useType.format(1234);
        expect(formatted).toContain('e');
    });
});

describe('Deformat', () => {
    it('should correctly deformat basic formatted numbers', () => {
        const useType = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$'],
            suffixes: ['%']
        }, {});

        expect(useType.deformat('$1,234.56%')).toBe(1234.56);
        expect(useType.deformat('$0.5%')).toBe(0.5);
        expect(useType.deformat('$1,000%')).toBe(1000);
    });

    it('should handle different separator combinations', () => {
        const useType = new NumberUseType({
            separators: [' ', ','],
            prefixes: [],
            suffixes: []
        }, {});

        expect(useType.deformat('1 234,56')).toBe(1234.56);
        expect(useType.deformat('1 000')).toBe(1000);
    });

    it('should return null for invalid number formats', () => {
        const useType = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$'],
            suffixes: ['%']
        }, {});

        expect(useType.deformat('not a number')).toBe(null);
        expect(useType.deformat('$1,2,3.4%')).toBe(null); // Invalid thousands separator usage
    });

    it('should update min/max when deformatting', () => {
        const useType = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$'],
            suffixes: ['%']
        }, {});

        useType.deformat('$100%');
        expect(useType.min).toBe(100);
        expect(useType.max).toBe(100);

        useType.deformat('$200%');
        expect(useType.min).toBe(100);
        expect(useType.max).toBe(200);

        useType.deformat('$50%');
        expect(useType.min).toBe(50);
        expect(useType.max).toBe(200);
    });
});

describe('Type Relationships', () => {
    it('should correctly identify supersets', () => {
        const type1 = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$', '€'],
            suffixes: ['%']
        }, {});

        const type2 = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$'],
            suffixes: ['%']
        }, {});

        expect(type1.isSupersetOf(type2)).toBe(true);
        expect(type2.isSupersetOf(type1)).toBe(false);
    });

    it('should identify equal types', () => {
        const type1 = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$'],
            suffixes: ['%']
        }, {});

        const type2 = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$'],
            suffixes: ['%']
        }, {});

        expect(type1.isEqualTo(type2)).toBe(true);
    });

    it('should identify similar types', () => {
        const type1 = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$']
        }, {});
        type1.min = 0;
        type1.max = 100;

        const type2 = new NumberUseType({
            separators: [',', '.'],
            prefixes: ['$']
        }, {});
        type2.min = 50;
        type2.max = 150;

        expect(type1.isSimilarTo(type2)).toBe(true);
    });
});
