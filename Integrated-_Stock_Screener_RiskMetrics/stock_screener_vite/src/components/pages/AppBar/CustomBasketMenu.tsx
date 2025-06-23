import React from 'react'
import { useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAppSelector } from "@/app/hooks";
import { BasketCompany, selectBasket } from "@/features/basket/basketSlice"
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import paths from '@/utils/constants/paths';


export default function CustomBasketMenu() {
    const navigate = useNavigate();
    const basket = useAppSelector(selectBasket);
    // console.log(basket)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleRemove = (company: BasketCompany) => {
        console.log("Clicked to remove company: ", company)
    }

    const handleCreatePortfolio = () => {
        navigate(paths.PORTFOLIO)
    }

    return (
        <>
            <IconButton
                color="primary"
                aria-label="add to shopping cart"
                onClick={handleClick}
                sx={{ marginRight: '2%', color: '#e0e0e0' }}
            >
                <ShoppingCartOutlinedIcon />
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    style: {
                        width: '380px', // customize width here

                    },
                }}
                sx={{ marginRight: '2%' }}
            >
                {basket.companies.length ? (
                    <div>

                        <Typography sx={{ width: '100%', paddingLeft: '6%', paddingBottom: '2%', fontWeight: 'bold' }}>My Basket</Typography>
                        <Divider />
                        {basket.companies.map((company, index) => (
                            <MenuItem key={index} onClick={handleClose}>
                                <div className='grid grid-cols-6 gap-4 w-full items-center' >
                                    <div className="col-span-5">

                                        {`${company.code} - ${company.name}`}
                                    </div>
                                    <div className="">

                                        <IconButton disabled color="primary" onClick={() => handleRemove(company)}>
                                            <ClearOutlinedIcon />
                                        </IconButton>
                                    </div>

                                </div>
                            </MenuItem>

                        ))}
                        <Divider />
                        <div className="grid justify-items-end p-2">
                            {/* <Button variant="contained" sx={{ marginRight: '4%' }}>Create Portfolio</Button> */}
                            <button
                                className='w-34 bg-slate-700 hover:bg-sky-600 border-solid border-2 border-sky-600 m-2 p-2 text-white rounded'
                                onClick={handleCreatePortfolio}
                            >
                                Create Portfolio
                            </button>
                        </div>
                    </div>

                )
                    :
                    (
                        <Typography sx={{ width: '100%', paddingLeft: '6%', whiteSpace: 'nowrap' }}>No Tickers Added</Typography>

                    )}

            </Menu>
        </>
    )
}

