import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export default function Logout({onLogout}){

    let navigate = useNavigate()

    localStorage.removeItem("token")
    onLogout();

    navigate('/posts')

    window.location.reload()
}

Logout.propTypes = {
    onLogout: PropTypes.func
}