import { Link } from "react-router-dom";


const Home = () => {
    return (
        <div>
            <h1>HOME!</h1>
            <button>
                <Link to="/gps">GPS!</Link>
            </button>
            <button style={{ marginLeft: '10px' }}>
                <Link to="/camera">CAMERA!</Link>
            </button>
        </div >
    )
}

export default Home;