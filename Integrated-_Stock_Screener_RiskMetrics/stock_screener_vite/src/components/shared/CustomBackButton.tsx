
import React from "react"
import { useNavigate } from "react-router-dom";


export default function CustomBackButton() {
    const navigate = useNavigate();

    const backButton = () => {
        navigate(-1)
    };

    return (
        <>
            <button
                className="w-34 bg-gray-700 hover:bg-sky-600 border-solid border-2 border-sky-600  m-2 p-2  text-white rounded "
                onClick={backButton}>
                Back
            </button>
        </>
    )
}

