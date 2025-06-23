import React from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';


interface StyleProps {
    bkgcolor?: string;
    txtcolor?: string;
    buttonwidth?: string;
    hoverbackgroundcolor?: string;
    hovercolor?: string;
}


const CustomToggleButton = styled(ToggleButton)<StyleProps>(({ bkgcolor, txtcolor, buttonwidth, hoverbackgroundcolor, hovercolor }) => ({
    width: buttonwidth || '12%',
    maxHeight: '45px',
    backgroundColor: bkgcolor || '#757575',
    color: txtcolor || '#fff',
    textTransform: 'none',
    '&:hover': {
        backgroundColor: hoverbackgroundcolor || '#424242',
        color: hovercolor || '#fff',
    },
    '&.Mui-selected': {
        backgroundColor: '#37474f',
        color: 'white',
        '&:hover': {
            backgroundColor: '#263238', // Darker shade when hovered
        },
    }
}));

interface Props {
    active: number,
    filterOptions: string[],
    buttonWidth: string
    disabledButton: number,
    updateOption: (event: React.MouseEvent<HTMLElement>, newActive: number) => void
}

export default function CustomToggleButtonGroup({ active, filterOptions, buttonWidth, disabledButton = -1, updateOption }: Props) {
    // console.log('Selected button index:', active)
    return (
        <>
            <ToggleButtonGroup value={active} onChange={updateOption} exclusive className="flex ml-16 w-full pr-6" >

                {filterOptions.map((option, index) => {
                    if (index === disabledButton) {
                        return (
                            <CustomToggleButton key={index} value={index} bkgcolor={"#bdbdbd"} buttonwidth={buttonWidth} disabled >
                                {option}
                            </CustomToggleButton>
                        )
                    }

                    return (
                        <CustomToggleButton key={index} value={index} buttonwidth={buttonWidth} selected={index === active}>
                            {option}
                        </CustomToggleButton>
                    )
                })
                }
            </ToggleButtonGroup>
        </>
    )
}

