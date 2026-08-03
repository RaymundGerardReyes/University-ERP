import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createLogger } from '@university-erp/core-logger';
import { Button, Card } from '@university-erp/ui-kit';
import { Component } from 'react';
const logger = createLogger('student-portal', 'ErrorBoundary');
export class ErrorBoundary extends Component {
    state = {
        hasError: false,
        error: null
    };
    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        // Track the specific runtime error in our centralized logger
        logger.error('Uncaught React Runtime Exception', error, errorInfo.componentStack);
    }
    handleReset = () => {
        // Clear the error and reload the page to try and recover
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };
    render() {
        if (this.state.hasError) {
            return (_jsx("div", { style: { display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', padding: '2rem' }, children: _jsxs(Card, { style: { maxWidth: '600px', borderColor: 'hsl(0, 70%, 50%)', borderWidth: '2px' }, children: [_jsx("h2", { style: { color: 'hsl(0, 70%, 70%)', marginTop: 0 }, children: "Something went wrong." }), _jsx("p", { style: { color: '#ccc', marginBottom: '1.5rem' }, children: "The application encountered an unexpected runtime error. Our engineering team has been notified via the system logs." }), _jsx("div", { style: { backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#aaa', overflowX: 'auto', marginBottom: '1.5rem' }, children: this.state.error?.message }), _jsx(Button, { variant: "primary", onClick: this.handleReset, style: { width: '100%' }, children: "Return to Dashboard" })] }) }));
        }
        return this.props.children;
    }
}
