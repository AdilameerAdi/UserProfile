import { Component } from 'react';

class AuthErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AuthErrorBoundary caught an error:', error, errorInfo);
    
    // Clear potentially corrupted auth state
    try {
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Dispatch event to notify auth context to reset
      window.dispatchEvent(new CustomEvent('auth-error-reset'));
    } catch (e) {
      console.warn('Could not clear auth storage:', e);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    // Force a page reload to ensure clean state
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white p-6">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">Authentication Error</h2>
            <p className="text-gray-300 mb-6">
              There was an issue with your login session. Please refresh to continue.
            </p>
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Refresh & Retry
              </button>
              <button
                onClick={() => window.location.href = '/login'}
                className="w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                Go to Login
              </button>
            </div>
            <div className="mt-4 text-sm text-gray-400">
              Error: {this.state.error?.message || 'Unknown authentication error'}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AuthErrorBoundary;