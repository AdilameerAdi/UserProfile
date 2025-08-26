import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // If it's an auth-related error, clear potentially corrupted state
    if (error.message?.includes('auth') || error.message?.includes('supabase')) {
      try {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      } catch (e) {
        console.warn('Could not clear auth storage:', e);
      }
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-300 mb-6">
              Don't worry, this happens sometimes. Try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
            <div className="mt-4">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Try Again Without Refresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;