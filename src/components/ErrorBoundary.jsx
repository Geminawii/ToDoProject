import { Component } from "react";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center text-center space-y-4 bg-orange-50">
          <h1 className="text-2xl font-bold text-orange-900">Something went wrong.</h1>
          <p className="text-orange-800">An unexpected error occurred.</p>
          <Button onClick={this.handleReset} className="bg-amber-800">Go Home</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
