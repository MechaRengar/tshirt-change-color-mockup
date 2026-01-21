import { Box, Grid, Typography } from "@material-ui/core";
import addColor from "../images/drop.svg";
import useStyles from "./CustomizeStyles.js";

function DesignNav() {
const classes = useStyles();
return (
<Grid className={classes.bar}>
 <Grid>
  <Box className={classes.tabs}>
   <a>
    <button className={classes.activeTabs}>
     <img height={50} src={addColor} />
     <Typography textDecoration="none" className={classes.barFont}>
      COLOR
     </Typography>
    </button>
   </a>
  </Box>
 </Grid>
</Grid>
);
}
export default DesignNav;
