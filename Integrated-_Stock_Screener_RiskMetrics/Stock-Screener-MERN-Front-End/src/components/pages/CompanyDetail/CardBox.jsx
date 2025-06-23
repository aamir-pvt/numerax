import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./CardBox.css";
function CardBox({ title, desc, active, ...props }) {
  return (
    <Card
      onClick={props.onClick}
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
