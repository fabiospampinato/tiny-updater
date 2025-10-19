// Based on MIT Licensed code from Deno
// https://github.com/denoland/std/blob/b8959a59f3843dbd4520a97662a1230e97dc953d/semver
// https://github.com/denoland/std/blob/b8959a59f3843dbd4520a97662a1230e97dc953d/LICENSE

/**
 * Compare two SemVers.
 *
 * Returns `0` if `version1` equals `version2`, or `1` if `version1` is greater, or `-1` if `version2` is
 * greater.
 *
 * Sorts in ascending order if passed to {@linkcode Array.sort}.
 *
 * @example Usage
 * ```ts
 * const version1 = parse("1.2.3");
 * const version2 = parse("1.2.4");
 *
 * assertEquals(compare(version1, version2), -1);
 * assertEquals(compare(version2, version1), 1);
 * assertEquals(compare(version1, version1), 0);
 * ```
 *
 * @param version1 The first SemVer to compare
 * @param version2 The second SemVer to compare
 * @returns `1` if `version1` is greater, `0` if equal, or `-1` if `version2` is greater
 */
export function compare(version1: SemVer, version2: SemVer): 1 | 0 | -1 {
	if (version1 === version2) return 0;
	return (
		compareNumber(version1.major, version2.major) ||
		compareNumber(version1.minor, version2.minor) ||
		compareNumber(version1.patch, version2.patch) ||
		checkIdentifier(version1.prerelease, version2.prerelease) ||
		compareIdentifier(version1.prerelease, version2.prerelease)
	);
}

/**
 * Attempt to parse a string as a semantic version, returning a SemVer object.
 *
 * @example Usage
 * ```ts
 * const version = parse("1.2.3");
 * assertEquals(version, {
 *   major: 1,
 *   minor: 2,
 *   patch: 3,
 *   prerelease: [],
 *   build: [],
 * });
 * ```
 *
 * @throws {TypeError} If the input string is invalid.
 * @param value The version string to parse
 * @returns A valid SemVer
 */
export function parse(value: string): SemVer {
	if (typeof value !== 'string') {
		throw new TypeError(
			`Cannot parse version as version must be a string: received ${typeof value}`,
		);
	}

	if (value.length > MAX_LENGTH) {
		throw new TypeError(
			`Cannot parse version as version length is too long: length is ${value.length}, max length is ${MAX_LENGTH}`,
		);
	}

	value = value.trim();

	const groups = value.match(FULL_REGEXP)?.groups;
	if (!groups) throw new TypeError(`Cannot parse version: ${value}`);

	const major = parseNumber(
		groups['major']!,
		`Cannot parse version ${value}: invalid major version`,
	);
	const minor = parseNumber(
		groups['minor']!,
		`Cannot parse version ${value}: invalid minor version`,
	);
	const patch = parseNumber(
		groups['patch']!,
		`Cannot parse version ${value}: invalid patch version`,
	);

	const prerelease = groups['prerelease'] ? parsePrerelease(groups['prerelease']) : [];
	const build = groups['buildmetadata'] ? parseBuild(groups['buildmetadata']) : [];

	return { major, minor, patch, prerelease, build };
}

/**
 * A SemVer object parsed into its constituent parts.
 */
interface SemVer {
	/** The major version */
	major: number;

	/** The minor version */
	minor: number;

	/** The patch version */
	patch: number;

	/**
	 * The prerelease version
	 * @default {[]}
	 */
	prerelease?: (string | number)[];

	/**
	 * The build metadata
	 * @default {[]}
	 */
	build?: string[];
}

function compareNumber(a: number, b: number): 1 | 0 | -1 {
	if (isNaN(a) || isNaN(b)) {
		throw new Error('Cannot compare against non-numbers');
	}
	return a === b ? 0 : a < b ? -1 : 1;
}

function checkIdentifier(
	v1: ReadonlyArray<string | number> = [],
	v2: ReadonlyArray<string | number> = [],
): 1 | 0 | -1 {
	// NOT having a prerelease is > having one
	// But NOT having a build is < having one
	if (v1.length && !v2.length) return -1;
	if (!v1.length && v2.length) return 1;
	return 0;
}

function compareIdentifier(
	v1: ReadonlyArray<string | number> = [],
	v2: ReadonlyArray<string | number> = [],
): 1 | 0 | -1 {
	const length = Math.max(v1.length, v2.length);
	for (let i = 0; i < length; i++) {
		const a = v1[i];
		const b = v2[i];
		// same length is equal
		if (a === undefined && b === undefined) return 0;
		// longer > shorter
		if (b === undefined) return 1;
		// shorter < longer
		if (a === undefined) return -1;
		// string > number
		if (typeof a === 'string' && typeof b === 'number') return 1;
		// number < string
		if (typeof a === 'number' && typeof b === 'string') return -1;
		if (a < b) return -1;
		if (a > b) return 1;
		// If they're equal, continue comparing segments.
	}
	return 0;
}

/**
 * A single `0`, or a non-zero digit followed by zero or more digits.
 */
const NUMERIC_IDENTIFIER = '0|[1-9]\\d*';

/**
 * Zero or more digits, followed by a letter or hyphen, and then zero or more letters, digits, or hyphens.
 */
const NON_NUMERIC_IDENTIFIER = '\\d*[a-zA-Z-][a-zA-Z0-9-]*';

/**
 * Three dot-separated numeric identifiers.
 */
const VERSION_CORE = `(?<major>${NUMERIC_IDENTIFIER})\\.(?<minor>${NUMERIC_IDENTIFIER})\\.(?<patch>${NUMERIC_IDENTIFIER})`;

/**
 * A numeric identifier, or a non-numeric identifier.
 */
const PRERELEASE_IDENTIFIER = `(?:${NUMERIC_IDENTIFIER}|${NON_NUMERIC_IDENTIFIER})`;

/**
 * A hyphen, followed by one or more dot-separated pre-release version identifiers.
 * @example "-pre.release"
 */
const PRERELEASE = `(?:-(?<prerelease>${PRERELEASE_IDENTIFIER}(?:\\.${PRERELEASE_IDENTIFIER})*))`;

/**
 * Any combination of digits, letters, or hyphens.
 */
const BUILD_IDENTIFIER = '[0-9A-Za-z-]+';

/**
 * A plus sign, followed by one or more period-separated build metadata identifiers.
 * @example "+build.meta"
 */
const BUILD = `(?:\\+(?<buildmetadata>${BUILD_IDENTIFIER}(?:\\.${BUILD_IDENTIFIER})*))`;

/**
 * A version, followed optionally by a pre-release version and build metadata.
 */
const FULL_VERSION = `v?${VERSION_CORE}${PRERELEASE}?${BUILD}?`;

const FULL_REGEXP = new RegExp(`^${FULL_VERSION}$`);

/**
 * Returns true if the value is a valid SemVer number.
 *
 * Must be a number. Must not be NaN. Can be positive or negative infinity.
 * Can be between 0 and MAX_SAFE_INTEGER.
 * @param value The value to check
 * @returns True if its a valid semver number
 */
function isValidNumber(value: unknown): value is number {
	return (
		typeof value === 'number' &&
		!Number.isNaN(value) &&
		(!Number.isFinite(value) || (0 <= value && value <= Number.MAX_SAFE_INTEGER))
	);
}

const MAX_LENGTH = 256;

const NUMERIC_IDENTIFIER_REGEXP = new RegExp(`^${NUMERIC_IDENTIFIER}$`);
function parsePrerelease(prerelease: string) {
	return prerelease
		.split('.')
		.filter(Boolean)
		.map((id: string) => {
			if (NUMERIC_IDENTIFIER_REGEXP.test(id)) {
				const number = Number(id);
				if (isValidNumber(number)) return number;
			}
			return id;
		});
}

function parseBuild(buildmetadata: string) {
	return buildmetadata.split('.').filter(Boolean);
}

function parseNumber(input: string, errorMessage: string) {
	const number = Number(input);
	if (!isValidNumber(number)) throw new TypeError(errorMessage);
	return number;
}
