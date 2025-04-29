import { Link } from "react-router-dom";


const Home = () => {

    return (
        <div>
            <h1>HOME!</h1>
            <Link to="/gps">GPS!</Link>
            <Link to="/camera">CAMERA!</Link>
        </div >
    )
}

export default Home;