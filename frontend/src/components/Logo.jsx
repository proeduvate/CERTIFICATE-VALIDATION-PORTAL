import cn from '../lib/cn';
import { APP } from '../config';
import './logo.css';

/**
 * ProEduvate wordmark.
 *
 * There are two brand assets: `proeduvate-logo-black.png` (dark "Pro", for
 * light backgrounds) and `proeduvate-logo.png` (white "Pro", for dark ones).
 * Both keep the blue mark.
 *
 * Both are rendered and swapped by CSS on `:root[data-theme]` rather than
 * switched in JS. That keeps the change instant on theme toggle, avoids a
 * re-render, and means the correct asset is already decoded — no flash of the
 * wrong logo.
 *
 * The previous approach applied `filter: invert(1)` to the black asset, which
 * also inverted the blue mark to orange.
 *
 * @param {'full'|'mark'} [props.variant] Wordmark, or just the icon.
 * @param {number} [props.height] Rendered height in px.
 */
export default function Logo({ variant = 'full', height, className }) {
    const style = height ? { '--logo-height': `${height}px` } : undefined;

    if (variant === 'mark') {
        // `icon only Transparent.png` is 4167x4167 but only ~3% of its pixels
        // are opaque: the plane sits centred in a large transparent canvas and
        // fills roughly the middle 38%. Rendered directly at 30px the visible
        // glyph is about 5px, which is why the mark read as missing. The box
        // clips and the image is scaled up so the glyph fills it.
        return (
            <span className={cn('logo__mark-box', className)} style={style}>
                <img
                    src="/icon only Transparent.png"
                    alt=""
                    className="logo__mark"
                    decoding="async"
                />
            </span>
        );
    }

    return (
        <span className={cn('logo', className)} style={style}>
            <img
                src="/proeduvate-logo-black.png"
                alt={APP.name}
                className="logo__img logo__img--light"
                decoding="async"
            />
            <img
                src="/proeduvate-logo.png"
                alt=""
                aria-hidden="true"
                className="logo__img logo__img--dark"
                decoding="async"
            />
        </span>
    );
}
