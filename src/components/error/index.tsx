export const Error = ({onRetry}: {onRetry: () => void}) => {
    return (<div>
        Someting went wrong. 
        <button onClick={onRetry}>Retry</button>
    </div>);
};
