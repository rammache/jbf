import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
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
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-gray-200 rounded-2xl p-8 shadow-xl text-center space-y-5">
            <div className="w-14 h-14 bg-blue-50 text-[#0077fe] rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#15161d] uppercase tracking-tight">
                Something Went Wrong
              </h2>
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                An unexpected interface issue occurred. Our diagnostic log recorded the event.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-gray-50 rounded-lg text-left border border-gray-100">
                <p className="text-[11px] font-mono text-red-600 break-words line-clamp-3">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#15161d] hover:bg-[#0077fe] text-white text-xs font-bold uppercase tracking-wider rounded transition"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reload Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold uppercase tracking-wider rounded transition"
              >
                <Home className="w-3.5 h-3.5" /> Return Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
