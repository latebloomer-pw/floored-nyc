'use client';

import { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4">
                    <h2 className="text-lg font-semibold text-red-600 mb-2">Something went wrong</h2>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        className="text-gray-600 hover:underline"
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}