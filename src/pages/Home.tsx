import { Link } from "react-router-dom";

const Home = () => {
    const handleToAngularMessage = () => {
        if ((window as any).ReactNativeWebView?.postMessage) {
            (window as any).ReactNativeWebView?.postMessage('toAngularProject');
        } else {
            console.warn('Message Error!')
        }
    }

    return (
        <>
            <h1>HOME!</h1>
            <Link to="/gps">
                <button>GPS!</button>
            </Link>
            <Link to="/camera">
                <button style={{ marginLeft: '10px' }}>CAMERA!</button>
            </Link>

            <button onClick={handleToAngularMessage}>
                前往Angular專案
            </button>
        </>
    )
}

export default Home;