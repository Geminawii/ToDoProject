import React, { Component, ReactNode } from "react";
import { Button } from "../components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/dashboard"; // reset by navigating
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center text-center space-y-4 bg-orange-50">
          <h1 className="text-2xl font-bold text-orange-900">
            Something went wrong.
          </h1>
          <p className="text-orange-800">An unexpected error occurred.</p>
          <Button
            onClick={this.handleReset}
            className="bg-amber-800"
            variant="default"
            size="md"
          >
            Go Home
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
