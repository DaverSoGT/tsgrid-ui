/**
 * tsgrid-ui/icons — SVG icon module (v3.0.0)
 *
 * 18 named icon functions, each returning an HTML SVG string.
 * Theming via fill="currentColor" — color is inherited from CSS.
 * Accessibility: aria-hidden="true" by default; role="img" + aria-label when label is provided.
 *
 * Design: D-1..D-10 from sdd/svg-component-icons/design (#1139)
 * Spec: R-SCI-1..5, R-A11y-1..6 from sdd/svg-component-icons/spec (#1138)
 */
/**
 * TsgIconName — union of all 18 icon kebab-case name strings (R-SCI-4)
 */
type TsgIconName = 'box' | 'check' | 'chevron-down' | 'collapse' | 'colors' | 'columns' | 'cross' | 'drop' | 'empty' | 'expand' | 'eye-dropper' | 'info' | 'paste' | 'pencil' | 'plus' | 'reload' | 'search' | 'settings';
/**
 * IconOpts — optional configuration for icon rendering (R-SCI-5)
 */
interface IconOpts {
    /** Accessible label. When provided: role="img" + aria-label. When absent: aria-hidden="true". */
    label?: string;
    /** CSS class appended to the <svg> element. No default class on <svg> (D-7). */
    class?: string;
    /** Icon size in CSS pixels — sets width and height attributes (D-8). */
    size?: number;
    /** Override fill color (e.g. 'red'). Default is 'currentColor' via CSS inheritance. */
    color?: string;
}
declare const boxIcon: (opts?: IconOpts) => string;
declare const checkIcon: (opts?: IconOpts) => string;
declare const chevronDownIcon: (opts?: IconOpts) => string;
declare const collapseIcon: (opts?: IconOpts) => string;
declare const colorsIcon: (opts?: IconOpts) => string;
declare const columnsIcon: (opts?: IconOpts) => string;
declare const crossIcon: (opts?: IconOpts) => string;
declare const dropIcon: (opts?: IconOpts) => string;
declare const emptyIcon: (opts?: IconOpts) => string;
declare const expandIcon: (opts?: IconOpts) => string;
declare const eyeDropperIcon: (opts?: IconOpts) => string;
declare const infoIcon: (opts?: IconOpts) => string;
declare const pasteIcon: (opts?: IconOpts) => string;
declare const pencilIcon: (opts?: IconOpts) => string;
declare const plusIcon: (opts?: IconOpts) => string;
declare const reloadIcon: (opts?: IconOpts) => string;
declare const searchIcon: (opts?: IconOpts) => string;
declare const settingsIcon: (opts?: IconOpts) => string;

export { type IconOpts, type TsgIconName, boxIcon, checkIcon, chevronDownIcon, collapseIcon, colorsIcon, columnsIcon, crossIcon, dropIcon, emptyIcon, expandIcon, eyeDropperIcon, infoIcon, pasteIcon, pencilIcon, plusIcon, reloadIcon, searchIcon, settingsIcon };
