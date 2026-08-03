import { createLogger } from '@university-erp/core-logger';
import { Button, Card } from '@university-erp/ui-kit';
import { Component, ErrorInfo, ReactNode } from 'react';

const logger = createLogger('student-portal', 'ErrorBoundary');

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Track the specific runtime error in our centralized logger
        logger.error('Uncaught React Runtime Exception', error, errorInfo.componentStack);
    }

    private handleReset = () => {
        // Clear the error and reload the page to try and recover
        this.setState({ hasError: false, error: null });
        window.location.href = '/';
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', padding: '2rem' }}>
                    <Card style={{ maxWidth: '600px', borderColor: 'hsl(0, 70%, 50%)', borderWidth: '2px' }}>
                        <h2 style={{ color: 'hsl(0, 70%, 70%)', marginTop: 0 }}>Something went wrong.</h2>
                        <p style={{ color: '#ccc', marginBottom: '1.5rem' }}>
                            The application encountered an unexpected runtime error. Our engineering team has been notified via the system logs.
                        </p>

                        {/* Show the error message for developers */}
                        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#aaa', overflowX: 'auto', marginBottom: '1.5rem' }}>
                            {this.state.error?.message}
                        </div>

                        <Button variant="primary" onClick={this.handleReset} style={{ width: '100%' }}>
                            Return to Dashboard
                        </Button>
                    </Card>
                </div>
            );
        }

        return this.props.children;
    }
}