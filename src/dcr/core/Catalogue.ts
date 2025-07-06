import Papa from 'papaparse';
import { determinePrimaryKeys } from '../mapper/mapper.main.js';
import { NumberUseType } from '../parser/index.js';
import { determineType } from '../parser/parse.main.js';
import { UseType } from '../parser/useType.js';
import { count, filterInclusionMinima } from '../utils/array.js';

export class Catalogue {

    private _auto: boolean;
    private _isHeaderValid: boolean = false;
    private _areUseTypesLoaded: boolean = false;
    /** Error object output from Papa Parse library */
    private _dataErr: object = {};
    private _areKeySetsLoaded = false;

    constructor() {
        this._auto = true;
    }

    /** Header of parsed data */
    private _header: string[] = [];

    get header() {
        if (!this._isHeaderValid && this._auto) this._checkHeaderValidity();
        return this._header;
    }

    /** Content of parsed data in form of a table */
    private _data: string[][] = [];

    /** Data table */
    get data() {
        return this._data;
    }

    /** Number of records (rows) */
    get height() {
        return this._data.length;
    }

    /** Number of features (columns) */
    get width() {
        return (this._data[0] ?? []).length;
    }

    /** Number of all values excluding header */
    get length() {
        return this.height * this.width;
    }

    private _useTypes: UseType<unknown>[] = [];

    get useTypes() {
        if (!this._areUseTypesLoaded && this._auto) this._determineUseTypes();
        return this._useTypes;
    }

    private _allUseTypes: UseType<unknown>[][] = [];

    get allUseTypes() {
        if (!this._areUseTypesLoaded && this._auto) this._determineUseTypes();
        return this._allUseTypes;
    }

    /** Metadata output from Papa Parse library */
    private _meta: object = {};

    get meta() {
        return this._meta;
    }

    get errors() {
        return this._dataErr;
    }

    /**
     * Set of determined primary (composite) keys in form of a list of groups of indexes of columns
     */
    private _keySets: number[][] = [];

    get keySets() {
        if (!this._areKeySetsLoaded) this._generateKeySets();
        return this._keySets;
    }

    /** I-th record (row) */
    row(i: number): string[] {
        return this._data[i];
    }

    /** I-th feature (column) */
    col(i: number): string[] {
        return this._data.map(row => row[i]);
    }

    /**
     * Called when a new dataset is loaded to avoid invalid states.
     */
    _reset() {
        this._header = [];
        this._data = [];
        this._dataErr = [];
        this._meta = {};
        this._useTypes = [];
        this._keySets = [];
        this._isHeaderValid = false;
        this._areUseTypesLoaded = false;
        this._areKeySetsLoaded = false;
    }

    /**
     * Method called by Papa Parse upon loading the input file.
     * Can be theoretically used from outside by simulating the Papa Parse response object.
     * @param papares Result of Papa parsing.
     */
    setData(papares: Papa.ParseResult<string[]> | string[][]) {

        this._reset();

        if (papares instanceof Array) {
            this._data = papares;
        } else {
            const data = papares.data;

            this._header = data[0];
            this._data = data.slice(1);
            this._meta = papares.meta;
            this._dataErr = papares.errors;
        }


        // last row empty
        if (this._data[this._data.length - 1].length === 1 && this._data[this._data.length - 1][0] === '') {
            this._data.splice(-1);
        }

        // last column empty
        if (this._data.every(row => row[row.length - 1].trim().length === 0)) {
            this._data = this._data.map(row => row.slice(0, -1));
        }

        // TODO: Determine width using begin and end, and consider it potential trash? what was i thinking?
        const firstRows = this._data.slice(0, 20);
        const lastRows = this._data.slice(this._data.length - 20, this._data.length);
        const columnCounts = count(firstRows.concat(lastRows).map(row => row.length));
        const columnCountsKvp = Object.entries(columnCounts);
        columnCountsKvp.sort((a, b) => b[1] - a[1]);
        const determinedColumnSize = +columnCountsKvp[0][0];

        // first and last few rows non-tabular
        let i = 0;
        while (this._data[i].length != determinedColumnSize) i++;
        this._data.splice(0, i - 1);
        i = this._data.length - 1;
        while (this._data[i].length != determinedColumnSize) i--;
        this._data.splice(i + 1, this._data.length - i);
    }

    _determineUseTypes() {
        this._useTypes = [];
        this._allUseTypes = [];

        for (let i = 0, len = this.width; i < len; i++) {
            const determinedUseTypes = determineType(this.col(i), {label: this._header[i]});
            this._allUseTypes[i] = determinedUseTypes;

            if (determinedUseTypes.length === 1) {
                this._useTypes[i] = determinedUseTypes[0];
            }
            // TODO: Confidence-level based selection
            else {
                // often single number will get detected as multiple kinds of timestamps
                // if (determinedUseTypes.filter(u => u.type === 'timestamp').length > 1) {
                //    determinedUseTypes = determinedUseTypes.filter(u => u.type !== 'timestamp');
                // }

                determinedUseTypes.sort((u, v) => v.priority - u.priority);
                this._useTypes[i] = determinedUseTypes[0];
            }
        }
        this._areUseTypesLoaded = true;
    }

    _checkHeaderValidity() {
        this._isHeaderValid = false;
        for (let i = 0; i < this._header.length; i++) {
            const ut: UseType<unknown> = this.useTypes[i];
            if (ut.hasNull && ut.nullVal === this._header[i]) this._isHeaderValid = false;
            if (ut.deformat(this._header[i]) === null) this._isHeaderValid = true;
        }
        if (!this._isHeaderValid) {
            this._data = [this._header, ...this._data];
            this._header = this._useTypes.map(ut => ut.toString());
            this._isHeaderValid = true;
            // fix ambiguous sets indexing
            for (let i = 0; i < this._useTypes.length; i++) {
                if (this._useTypes[i].ambiguousSets) {
                    this._useTypes[i].ambiguousSets = this._useTypes[i].ambiguousSets.map(set => set.map(val => +val + 1));
                    const ambiVals = this._useTypes[i].ambiguousSets.map(set => this._data[set[0]][i]);
                    for (let j = 0; j < ambiVals.length; j++) {
                        if (this._data[0][i] === ambiVals[j]) this._useTypes[i].ambiguousSets[j].push(0);
                    }
                }
            }
        }
    }

    _generateKeySets() {
        const representatives = this.useTypes;
        const repLabels = [...Array(this.useTypes.length).keys()];

        const trivialKeys = repLabels.filter(i => representatives[i].potentialIds);
        // const trivialNonKeys = repLabels.filter(i => representatives[i].isConstant);

        const nonDetermined = representatives.filter(rep => !rep.potentialIds && !rep.isConstant && !rep.ignored);
        const nonDeterminedLabels = repLabels.filter(i => !representatives[i].potentialIds && !representatives[i].isConstant);

        const ambiguitySets = nonDetermined.map(rep => rep.ambiguousSets);
        const compositeKeys = determinePrimaryKeys(ambiguitySets);
        let compositeKeyLabels = compositeKeys.map(key => key.map(idx => nonDeterminedLabels[idx]));

        const minimal = filterInclusionMinima(compositeKeyLabels);
        if (minimal.length !== compositeKeyLabels.length) {
            compositeKeyLabels = minimal;
        }

        this._keySets = trivialKeys.map(key => [key]).concat(compositeKeyLabels);

        // necessary artificial key
        if (this._keySets.length === 0) {
            this._keySets = [[-1]];
            this._useTypes[-1] = NumberUseType.getIdUsetype();
            this._data.forEach((row, i) => row[-1] = String(i));
        }
        this._areKeySetsLoaded = true;
    }
}
