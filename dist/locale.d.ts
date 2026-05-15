/**
 * Part of TsUi 2.0 library
 *  - Dependencies: none
 *
 * These are the master locale settings that will be used by TsUtils
 *
 * "locale" should be the IETF language tag in the form xx-YY,
 * where xx is the ISO 639-1 language code ( see https://en.wikipedia.org/wiki/ISO_639-1 ) and
 * YY is the ISO 3166-1 alpha-2 country code ( see https://en.wikipedia.org/wiki/ISO_3166-2 )
 */
interface TsLocaleSettings {
    locale: string;
    dateFormat: string;
    timeFormat: string;
    datetimeFormat: string;
    currencyPrefix: string;
    currencySuffix: string;
    currencyPrecision: number;
    groupSymbol: string;
    decimalSymbol: string;
    shortmonths: string[];
    fullmonths: string[];
    shortdays: string[];
    fulldays: string[];
    weekStarts: string;
    phrases: Record<string, string> | null;
}
declare const TsLocale: TsLocaleSettings;

export { TsLocale, type TsLocaleSettings };
