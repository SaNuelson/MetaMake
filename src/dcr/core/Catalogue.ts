import { bindEventSystemMixin } from '../utils/events.js';
import { UseType } from '../parser/useType';
import { NumberUseType } from '../parser/parse.num';
import { determineType } from '../parser/parse.main';
import { determinePrimaryKeys } from '../mapper/mapper.main';
import {
    count,
    toKvp,
    intersection,
    filterInclusionMinimas,
} from '../utils/array';
import Papa from 'papaparse';

// Hard limit to prevent OOM in cases of large files
// Set to 0 to turn off
export const hardRowLimit = 5000;

/**
 * Catalogue class server is the top-most manager of chart rendering.
 * Once instantiated, it can be provided with data source, either via "loadFromUrl" + (url:string) or "loadFromLocal" + (File:Stream) methods.
 * Once data is loaded and sliced using Papaparse library, an event eventHandles.sourceChange is triggered,
 * to which user can subscribe via "catalogue.addEventListener()".
 * Bindings can be queried using a getter, or generated explicitly by "generateBindings" function.
 * Once done, these can be used to render charts by simply calling "drawBinding" method with appropriate parameters.
 *
 * Can work in two modes: manual and automatic.
 * Automatic is the main goal, it generates all metadata automatically.
 * Manual is currently in development, aiming to create a semi-manual version, which
 * generates metadata automatically, but can be manually altered.
 */
export class Catalogue {

    private _auto: boolean;

    /** Header of parsed data */
    private _header: string[] = [];
    private _isHeaderValid: boolean = false;

    get header() {
        if (!this._isHeaderValid && this._auto)
            this._checkHeaderValidity();
        return this._header;
    }

    /** Content of parsed data in form of a table */
    private _data: string[][] = [];

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

    /** Data table */
    get data() {
        return this._data;
    }

    /** I-th record (row) */
    row(i: number): string[] {
        return this._data[i];
    }

    /** I-th feature (column) */
    col(i: number): string[] {
        return this._data.map(row => row[i]);
    }

    private _useTypes: UseType<any>[] = [];
    private _allUseTypes: UseType<any>[][] = [];
    private _areUseTypesLoaded: boolean = false;

    get useTypes() {
        if (!this._areUseTypesLoaded && this._auto)
            this._determineUseTypes();
        return this._useTypes;
    }

    get allUseTypes() {
        if (!this._areUseTypesLoaded && this._auto)
            this._determineUseTypes()
        return this._allUseTypes;
    }

    /** Metadata output from Papa Parse library */
    private _meta: object = {};
    get meta() {
        return this._meta;
    }

    /** Error object output from Papa Parse library */
    private _dataErr: object = {};

    get errors() {
        return this._dataErr;
    }

    /**
     * Set of determined primary (composite) keys in form of list of groups of indexes of columns
     */
    private _keySets: number[][] = [];
    private _areKeySetsLoaded = false;

    get keySets() {
        if (!this._areKeySetsLoaded)
            this._generateKeySets();
        return this._keySets;
    }

    constructor() {
        this._auto = true;
    }

    /**
     * Called when new dataset is loaded to avoid invalid states.
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
    setData(papares: Papa.ParseResult<any>) {
        this._reset();
        let data = papares.data;

        // last row empty
        if (data[data.length - 1].length === 1 && data[data.length - 1][0] === '') {
            data.splice(-1);
        }

        // last column empty
        if (data.every(row => row[row.length - 1].trim().length === 0)) {
            data = data.map(row => row.slice(0, -1));
        }

        let firstRows = data.slice(0, 20);
        let lastRows = data.slice(data.length - 20, data.length);
        let columnCounts = count(firstRows.concat(lastRows).map(row => row.length));
        let columnCountsKvp = toKvp(columnCounts);
        columnCountsKvp.sort((a, b) => b[1] - a[1]);
        let determinedColumnSize = columnCountsKvp[0][0];

        // first and last few rows non-tabular
        let i = 0;
        while (data[i].length != determinedColumnSize) i++;
        data.splice(0, i - 1);
        i = data.length - 1;
        while (data[i].length != determinedColumnSize) i--;
        data.splice(i + 1, data.length - i);

        this._header = data[0];
        this._data = data.slice(1);
        this._meta = papares.meta;
        this._dataErr = papares.errors;
    }

    _determineUseTypes() {
        this._useTypes = [];
        this._allUseTypes = [];

        for (let i = 0, len = this.width; i < len; i++) {
            let determinedUseTypes = determineType(this.col(i), {label: this._header[i]});
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
            let ut: UseType<any> = this.useTypes[i];
            if (ut.hasNull && ut.nullVal === this._header[i])
                this._isHeaderValid = false;
            if (ut.deformat(this._header[i]) === null)
                this._isHeaderValid = true;
        }
        if (!this._isHeaderValid) {
            this._data = [this._header, ...this._data];
            this._header = this._useTypes.map(ut => ut.toString());
            this._isHeaderValid = true;
            // fix ambiguous sets indexing
            for (let i = 0; i < this._useTypes.length; i++) {
                if (this._useTypes[i].ambiguousSets) {
                    this._useTypes[i].ambiguousSets = this._useTypes[i].ambiguousSets.map(set => set.map(val => +val + 1));
                    let ambiVals = this._useTypes[i].ambiguousSets.map(set => this._data[set[0]][i]);
                    for (let j = 0; j < ambiVals.length; j++) {
                        if (this._data[0][i] === ambiVals[j])
                            this._useTypes[i].ambiguousSets[j].push(0);
                    }
                }
            }
        }
    }

    _generateKeySets() {
        let representatives = this.useTypes;
        let repLabels = [...Array(this.useTypes.length).keys()];

        let trivialKeys = repLabels.filter(i => representatives[i].potentialIds);
        let trivialNonKeys = repLabels.filter(i => representatives[i].isConstant);

        let nonDetermined = representatives.filter(rep => !rep.potentialIds && !rep.isConstant && !rep.ignored);
        let nonDeterminedLabels = repLabels.filter(i => !representatives[i].potentialIds && !representatives[i].isConstant);

        let ambiguitySets = nonDetermined.map(rep => rep.ambiguousSets);
        let compositeKeys = determinePrimaryKeys(ambiguitySets);
        let compositeKeyLabels = compositeKeys.map(key => key.map(idx => nonDeterminedLabels[idx]));

        let minimal = filterInclusionMinimas(compositeKeyLabels);
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