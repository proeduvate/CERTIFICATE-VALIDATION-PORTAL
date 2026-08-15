import { Component } from 'react';
import Icon from './ui/Icon';

/**
 * Catches render-time crashes so a single bad component shows a recoverable
 * message instead of a blank white page.
 */
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error) {
        return { error };
    }

    componentDidCatch(error, info) {
        console.error('Unhandled UI error:', error, info?.componentStack);
    }

    render() {
        const { error } = this.state;

        if (!error) return this.props.children;

        return (
            <div className="empty-state" style={{ minHeight: '100vh' }}>
                <span className="empty-state__icon">
                    <Icon name="alertTriangle" size={24} />
                </span>

                <h1 className="empty-state__title">This page hit an unexpected error</h1>
                <p className="empty-state__message">
                    Reloading usually clears it. If it keeps happening, please pass the
                    details below to the team.
                </p>

                {import.meta.env.DEV && (
                    <pre
                        style={{
                            maxWidth: '640px',
                            overflowX: 'auto',
                            textAlign: 'left',
                            fontSize: 'var(--text-xs)',
                            background: 'var(--bg-sunken)',
                            padding: 'var(--space-4)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--danger)',
                        }}
                    >
                        {error.message}
                    </pre>
                )}

                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => window.location.reload()}
                    >
                        <Icon name="refresh" size={16} />
                        Reload page
                    </button>

                    <a className="btn btn--secondary" href="/">
                        Go home
                    </a>
                </div>
            </div>
        );
    }
}
