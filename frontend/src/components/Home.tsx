import {makeStyles} from '@material-ui/core';
import {Button, Paper, SvgIcon, TextField} from "@material-ui/core";
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
  },
  canvas: {
      width: "500px",
      height: "500px"
  }
}));


function Home() {

    // SearchIcon and KeyboardArrowDownIcon via material-ui/icons throws errors, so manually with svg path
    const SearchIcon = <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />;
    const KeyboardArrowDownIcon = <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />;

    const classes = useStyles();

    const [result, setResult] = useState<string>( "" );


    const handleOnChange = (e:any) => {

        let options = {};
        let smilesDrawer = new SmilesDrawer.Drawer( options );

        SmilesDrawer.parse(e.target.value, function(tree:any) {
            smilesDrawer.draw(tree, "smiles-drawer", "light", false);
        });
	};


    const showLastCalculation = () => {

        // TODO: implement
    }


    const calculate = () => {

        // TODO: implement
    }


    return (
        <Paper className="paper">
		    <div className={classes.row}>
		        <TextField label="SMILES" variant="outlined" className={classes.textField} onChange={handleOnChange} />
		        <Button variant="contained" color="primary" className={classes.button} onClick={showLastCalculation}><SvgIcon>{KeyboardArrowDownIcon}</SvgIcon></Button>
		        <Button variant="contained" color="primary" className={classes.button} onClick={calculate}><SvgIcon>{SearchIcon}</SvgIcon></Button>
		    </div>
            <canvas id="smiles-drawer" className={classes.canvas} />
            {result && (<p>{result}</p>)}
		</Paper>
	);
}


export default Home;