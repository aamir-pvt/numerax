import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Typography } from '@mui/material';

import "./CardBox.css";

interface Props {
  title: string;
  desc: string;
  active: string;
  onClick: () => void;
}

function CardBox({ title, desc, active, onClick }: Props) {
  return (
    <Card
      onClick={onClick}
      className={`infoBox  ${active === title && "infoBox--selected"}`}
    >
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography className="infoBox_description">{desc}</Typography>
      </CardContent>
    </Card>
  );
}

export default CardBox;
