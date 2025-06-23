import { Checkbox } from '@mui/material'
import React from 'react'

interface Props {
    checked: boolean
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void

}

function CustomCheckBox({ checked, handleChange }: Props) {
    return (
        <>
            <Checkbox
                checked={checked}
                onChange={handleChange}
                size="small"
                sx={{ paddingTop: '4%' }} />
        </>
    )
}

export default CustomCheckBox