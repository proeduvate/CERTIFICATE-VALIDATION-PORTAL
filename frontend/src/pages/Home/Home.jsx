import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Display';
import { APP } from '../../config';
import './home.css';

/**
 * Public landing page.
 *
 * Removed from the previous version: a hardcoded three-record "certificate
 * database" used to fake a live lookup, a search modal duplicating the
 * verification page, four pieces of unused state, and nav links pointing at
 * `#employers` / `#institutions` / `#about` anchors that did not exist on the
 * page. Verification now hands off to /verify, which does the real lookup.
 */

const VALUE_PROPS = [
    {
        icon: 'shieldCheck',
        tint: 'brand',
        title: 'Issued, not asserted',
        body: 'Every result is matched against the record created when the certificate was issued — not against the document someone sends you.',
    },
    {
        icon: 'zap',
        tint: 'green',
        title: 'Answers in seconds',
        body: 'Paste a reference number and get a verdict immediately, with no account, phone call or email thread required.',
    },
    {
        icon: 'fileText',
        tint: 'purple',
        title: 'The full picture',
        body: 'Beyond a yes or no: the internship it belongs to, when it ran, and when the certificate was issued.',
    },
    {
        icon: 'lock',
        tint: 'amber',
        title: 'Least privilege by default',
        body: 'Verification exposes issuance facts. Personal intern records stay behind authentication and role checks.',
    },
];

const AUDIENCES = [
    {
        id: 'employers',
        icon: 'briefcase',
        title: 'For employers',
        body: 'Confirm an applicant’s internship before you shortlist. No sign-up, no waiting on a reference check.',
        points: [
            'Check a reference number in seconds',
            'See the internship the certificate covers',
            'Get a clear answer when nothing matches',
        ],
    },
    {
        id: 'institutions',
        icon: 'graduationCap',
        title: 'For institutions',
        body: 'Validate the placements your students report, and resolve discrepancies against the issuing record.',
        points: [
            'Verify student-submitted certificates',
            'Confirm issue dates and durations',
            'Escalate anything that does not resolve',
        ],
    },
    {
        id: 'partners',
        icon: 'building',
        title: 'For partner organisations',
        body: 'Give every intern you host a credential that stands up to scrutiny long after the programme ends.',
        points: [
            'Credentials that outlive the placement',
            'One reference for every downstream check',
            'Consistent records across cohorts',
        ],
    },
];

export default function Home() {
    const navigate = useNavigate();
    const [reference, setReference] = useState('');

    const handleVerify = (event) => {
        event.preventDefault();
        const value = reference.trim().toUpperCase();
        navigate(value ? `/verify/${encodeURIComponent(value)}` : '/verify');
    };

    return (
        <div className="home">
            {/* ================= Hero ================= */}
            <section className="home-hero">
                <div className="home-hero__inner">
                    <div className="home-hero__copy">
                        <Badge variant="brand" icon="shieldCheck">
                            Trusted · Transparent · Verifiable
                        </Badge>

                        <h1 className="home-hero__title">
                            Check an internship certificate
                            <br />
                            <span className="home-hero__accent">against the record.</span>
                        </h1>

                        <p className="home-hero__lede">
                            {APP.name} issues every internship certificate from a record we
                            hold. Enter the reference printed on one and see whether it
                            matches — instantly, and for free.
                        </p>

                        <form className="home-hero__form" onSubmit={handleVerify}>
                            <label className="visually-hidden" htmlFor="home-reference">
                                Certificate reference number
                            </label>

                            <div className="home-hero__input">
                                <Icon name="award" size={18} />
                                <input
                                    id="home-reference"
                                    type="text"
                                    className="input"
                                    placeholder="e.g. PEV-2024-000123"
                                    value={reference}
                                    onChange={(event) => setReference(event.target.value)}
                                    autoComplete="off"
                                    spellCheck="false"
                                />
                            </div>

                            <Button type="submit" variant="primary" size="lg" icon="search">
                                Verify
                            </Button>
                        </form>

                        <p className="home-hero__hint">
                            Don’t have a reference to hand?{' '}
                            <a href="/verify">See how verification works</a>.
                        </p>
                    </div>

                    {/* Illustrative panel — clearly a diagram, not a live result */}
                    <div className="home-hero__visual" aria-hidden="true">
                        <div className="home-flow">
                            <div className="home-flow__step">
                                <span className="home-flow__icon tint-grey">
                                    <Icon name="award" size={18} />
                                </span>
                                <div>
                                    <strong>Certificate</strong>
                                    <span className="mono">PEV-2024-000123</span>
                                </div>
                            </div>

                            <span className="home-flow__arrow">
                                <Icon name="chevronDown" size={18} />
                            </span>

                            <div className="home-flow__step">
                                <span className="home-flow__icon tint-brand">
                                    <Icon name="search" size={18} />
                                </span>
                                <div>
                                    <strong>Reference lookup</strong>
                                    <span>Matched against issuing records</span>
                                </div>
                            </div>

                            <span className="home-flow__arrow">
                                <Icon name="chevronDown" size={18} />
                            </span>

                            <div className="home-flow__step home-flow__step--result">
                                <span className="home-flow__icon tint-green">
                                    <Icon name="shieldCheck" size={18} />
                                </span>
                                <div>
                                    <strong>Verified</strong>
                                    <span>Issue date and internship shown</span>
                                </div>
                            </div>

                            <div className="home-flow__alt">
                                <Icon name="xCircle" size={14} />
                                No match returns an explicit “not found”, never a pass.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Value props ================= */}
            <section className="home-section" id="why">
                <header className="home-section__head">
                    <h2>Why the portal exists</h2>
                    <p>
                        A certificate is easy to fabricate. A record held by the issuer is
                        not.
                    </p>
                </header>

                <div className="home-grid home-grid--4">
                    {VALUE_PROPS.map((item) => (
                        <article className="home-card" key={item.title}>
                            <span className={`home-card__icon tint-${item.tint}`}>
                                <Icon name={item.icon} size={20} />
                            </span>
                            <h3>{item.title}</h3>
                            <p>{item.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            {/* ================= Audiences ================= */}
            <section className="home-section home-section--muted" id="audiences">
                <header className="home-section__head">
                    <h2>Who it’s for</h2>
                    <p>
                        The same lookup, whichever side of the credential you are standing
                        on.
                    </p>
                </header>

                <div className="home-grid home-grid--3">
                    {AUDIENCES.map((audience) => (
                        <article className="home-card home-card--tall" key={audience.id}>
                            <span className="home-card__icon tint-brand">
                                <Icon name={audience.icon} size={20} />
                            </span>

                            <h3>{audience.title}</h3>
                            <p>{audience.body}</p>

                            <ul className="home-card__list">
                                {audience.points.map((point) => (
                                    <li key={point}>
                                        <Icon name="check" size={14} />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </article>
                    ))}
                </div>
            </section>

            {/* ================= CTA ================= */}
            <section className="home-cta">
                <div className="home-cta__inner">
                    <div>
                        <h2>Have a certificate in front of you?</h2>
                        <p>
                            Enter its reference number and get an answer before you finish
                            reading this sentence.
                        </p>
                    </div>

                    <div className="home-cta__actions">
                        <Button to="/verify" variant="primary" size="lg" icon="shieldCheck">
                            Verify a certificate
                        </Button>
                        <Button
                            href={`mailto:${APP.supportEmail}`}
                            variant="secondary"
                            size="lg"
                            icon="mail"
                        >
                            Contact {APP.name}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
