// Customize.js file
import React, { useState } from "react";
import { Grid, Box } from "@material-ui/core";
import useStyles from "./CustomizeStyles.js";
import { CirclePicker } from "react-color";
import Tshirt from "./tshirt.jsx";
import DesignNav from "./designNav.jsx";
import TshirtV2 from "./tshirtv2.jsx";
import TshirtV3 from "./tshirtv3.jsx";

const Customize = () => {
  const classes = useStyles();

  const [textLayerColors, setTextLayerColors] = useState([
    "#ffffff",
    "#000000",
    "#f44336",
    "#e91e63",
    "#9c27b0",
    "#673ab7",
    "#3f51b5",
    "#2196f3",
    "#03a9f4",
    "#00bcd4",
    "#009688",
    "#4caf50",
    "#8bc34a",
    "#cddc39",
    "#ffeb3b",
    "#ffc107",
    "#ff9800",
    "#ff5722",
    "#795548",
    "#607d8b",
    "#C0C0C0",
    "#C9AE5D",
  ]);

  const [color, setColor] = useState("#ffffff");

  return (
    <Grid container>
      <Grid item xs={4}>
        <Grid item xs={3} className={classes.barContainer}>
          <DesignNav />

          <Box className={classes.barBox}>
            <Grid container>
              <div className="color-picker">
                <CirclePicker
                  id="circle-picker"
                  circleSize={35}
                  colors={textLayerColors}
                  onChange={(color) => {
                    setColor(color.rgb);
                    console.log(color);
                  }}
                />
              </div>
            </Grid>
          </Box>
        </Grid>

        <Grid item xs={9}></Grid>
      </Grid>

      <Grid item xs={6}>
        <TshirtV3 color={color} />
      </Grid>
    </Grid>
  );
};

export default Customize;
