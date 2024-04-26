import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // 다음 렌더링에서 대체 UI를 보여주기 위해 상태를 업데이트합니다.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 에러 로깅을 할 수 있습니다.
        // 예: logErrorToMyService(error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // 에러가 발생하면 대체 UI를 렌더링할 수 있습니다.
            return (
                <div>
                    <h2>Something went wrong.</h2>
                    <details style={{ whiteSpace: 'pre-wrap' }}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        // 에러가 없으면 자식 컴포넌트를 정상적으로 렌더링합니다.
        return this.props.children;
    }
}

export default ErrorBoundary;