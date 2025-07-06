
//////////////
/////////////  MUSTs
////////////

//#region Unary

/**
 * Generate a unary NOT wrapper
 * @param {function (...any) : boolean} f
 * @returns {function (...any) : boolean}
 */
const mustNot = f => ((...p) => !f(...p));

//#endregion

//#region Binary

/**
 * Generate a binary AND merger
 * @param {function (...any) : boolean} f
 * @param {function (...any) : boolean} g
 * @returns {function (...any) : boolean} f(...p) AND g(...p)
 */
const mustBoth = (f, g) => ((...p) => f(...p) && g(...p));

/**
 * Generate a binary OR merger
 * @param {function (...any) : boolean} f
 * @param {function (...any) : boolean} g
 * @returns {function (...any) : boolean} f(...p) OR g(...p)
 */
const mustEither = (f, g) => ((...p) => f(...p) || g(...p));

/**
 * Generate a binary IMPLIES (=>) merger
 * @param {function (...any) : boolean} f
 * @param {function (...any) : boolean} g
 * @returns {function (...any) : boolean} f(...p) => g(...p)
 */
const mustImply = (f, g) => ((...p) => !f(...p) || g(...p));

/**
 * Generate a binary IMPLIEDBY (<=) merger
 * @param {function (...any) : boolean} f
 * @param {function (...any) : boolean} g
 * @returns {function (...any) : boolean} f(...p) <= g(...p)
 */
const mustBeImpliedBy = (f, g) => ((...p) => f(...p) || !g(...p));

/**
 * Generate a binary IFF (==) merger
 * @param {function (...any) : boolean} f
 * @param {function (...any) : boolean} g
 * @returns {function (...any) : boolean} f(...p) == g(...p)
 */
const mustIff = (f, g) => ((...p) => f(...p) === g(...p));

//#endregion

//#region Arbitrary

/**
 * Generate an ALL merger (strict)
 * @param {Array.<function (...any) : boolean>} fs
 * @returns {function (...any) : boolean} for each f in fs: f(...p)
 */
const mustAll = (...fs) => ((...p) => fs.every(f => f(...p)));

/**
 * Generate an ANY merger (non-strict)
 * @param {Array.<function (...any) : boolean>} fs
 * @returns {function (...any) : boolean} exists f in fs: f(...p)
 */
const mustAny = (...fs) => ((...p) => fs.some(f => f(...p)));

/**
 * Generate a NONE merger (non-strict)
 * @param {Array.<function (...any) : boolean>} fs
 * @returns {function (...any) : boolean} for each f in fs: NOT f(...p)
 */
const mustNone = (...fs) => !mustAny(...fs);

/**
 * Generate an NOT ALL merger
 * @param {Array.<function (...any) : boolean>} fs
 * @returns {function (...any) : boolean} exists f in fs: NOT f(...p)
 */
const mustNotAll = (...fs) => !mustAll(...fs);

/**
 * Generate an IFF merger
 * @param {Array.<function (...any) : boolean>} fs
 * @returns {function (...any) : boolean} for each f,g in fs: f(...p) == g(...p)
 */
const mustEqual = (...fs) => mustAny(mustAll(...fs), mustNone(...fs));

const must = {
    not: mustNot,
    both: mustBoth,
    either: mustEither,
    imply: mustImply,
    implied: mustBeImpliedBy,
    equal: mustIff,
    all: mustAll,
    any: mustAny,
    none: mustNone,
    notAll: mustNotAll,
    equalAll: mustIff,
};

export { must };
//#endregion
