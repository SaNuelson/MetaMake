import * as path from 'path';
import { LocalCsvDataSource } from '../local-csv-data-source';
import { LocalDataSource } from '../local-data-source';

describe('LocalCsvDataSource test', () => {
    it('should read local CSV file', async () => {
        const myDataSource = await LocalCsvDataSource.create(path.resolve(__dirname, './__data__/sample.csv'));

        const data = await myDataSource.readNext();

        expect(data).not.toBeFalsy();
        expect(data.length).toBeGreaterThan(0);
    });
});
