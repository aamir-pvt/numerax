import React from 'react'

interface Props {
    buttonText: string,
    warningColor?: boolean,
    handleOnClick?: () => void

}

export default function CustomButton({ buttonText, warningColor, handleOnClick }: Props) {
    return (
        <>
            {!warningColor ? (
                <button
                    className='w-34 bg-slate-700 hover:bg-sky-600 border-solid border-2 border-sky-600 m-2 p-2 text-white rounded'
                    onClick={handleOnClick}
                >
                    {buttonText}
                </button>
            ) : (
                <button
                    className='w-34 bg-rose-400 hover:bg-rose-300 border-solid border-2 border-rose-400 m-2 p-2 text-white rounded'
                    onClick={handleOnClick}
                >
                    {buttonText}
                </button>
            )}
        </>
    );
}

