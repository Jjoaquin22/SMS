import { useNavigate } from "react-router-dom";

function Back() {
    const navigate = useNavigate();

    return (
        <button onClick={() => navigate("/")}>
            Back
        </button>
    );
}

export default Back;