import {makeStyles} from '@material-ui/core';
import {Button, IconButton, Paper, SvgIcon, TextField} from "@material-ui/core";

//import {KeyboardArrowDown, Search} from '@material-ui/icons';
import KeyboardArrowDown from "@material-ui/icons/Search";
import Search from "@material-ui/icons/Search";

import React, {useState} from "react";
import {API_URL} from "../config";

// not working: import SmilesDrawer from "smiles-drawer";
const SmilesDrawer = require("smiles-drawer");


const useStyles = makeStyles((theme) => ({

  row: {
      display: "flex"
  },
  textField: {
      flex: 1
  },
  button: {
      marginLeft: "16px"
  }
}));


function Home() {

    const classes = useStyles();

    const [result, setResult] = useState<string>( "" );


    const handleOnChange = (e:any) => {

        let options = {};
        let smilesDrawer = new SmilesDrawer.Drawer( options );

        SmilesDrawer.parse(e.target.value, function(tree:any) {
            smilesDrawer.draw(tree, "example-canvas", "light", false);
        });
	};


    const showLastCalculation = () => {

        // TODO: implement
    }


    const calculate = () => {

        // TODO: implement
    }


    // TODO
    // startIcon={<KeyboardArrowDownIcon />}
    // startIcon={<SearchIcon />}

	return (<div>
		<Paper className="paper">
		    <div className={classes.row}>
		        <TextField label="SMILES" variant="outlined" className={classes.textField} onChange={handleOnChange} />
		        <Button variant="contained" color="primary" className={classes.button} onClick={showLastCalculation}>D</Button>
		        <Button variant="contained" color="primary" className={classes.button} onClick={calculate}>S</Button>
		    </div>
			<canvas id="example-canvas" width="500" height="500" />
		</Paper></div>
	);
}


export default Home;