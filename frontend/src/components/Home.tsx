import {makeStyles} from '@material-ui/core';
import {Button, CircularProgress, Paper, SvgIcon, Table, TableBody, TableCell, TableRow, TextField, Typography} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {BACKEND_URL} from "../config";

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
  heading: {
      margin: "2em 0 1em 0"
  },
  table: {
      wordBreak: "break-word"
  },
  trLeft: {
      width: "125px",
      paddingLeft: "0"
  },
  trRight: {
      paddingRight: "0"
  },
  noBorder: {
      border: "none"
  }
}));


function Home() {

    // KeyboardArrowDownIcon and SearchIcon via material-ui/icons throws errors, so manually with svg path
    const KeyboardArrowDownIcon = <path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z" />;
    const SearchIcon = <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />;

    const classes = useStyles();

    const { token } = useParams();

    const [chemicals,             setChemicals            ] = useState( [] );
    const [input,                 setInput                ] = useState<string>( "" );
    const [showInfos,             setShowInfos            ] = useState<boolean>( false );
    const [chemicalInfo,          setChemicalInfo         ] = useState<any>( {} );
    const [chemicalInfoIsLoading, setChemicalInfoIsLoading] = useState<boolean>( false );
    const [result,                setResult               ] = useState<string>( "" );
    const [resultIsLoading,       setResultIsLoading      ] = useState<boolean>( false );


    useEffect(() => {  // equivalent to componentDidMount

        fetchChemicals();
    }, []);


    useEffect(() => {  // equivalent to componentDidUpdate

        // the smiles cannot be drawn in calculate because the canvas
        // is not rendered at that time

        const smilesDrawer = new SmilesDrawer.Drawer({ height: 300, width: 500 });

        SmilesDrawer.parse(input, function(tree:any) {
            smilesDrawer.draw(tree, "smiles-drawer", "light", false);
        });
    }, [showInfos]);


    const fetchChemicals = async () => {

        const response = await fetch( BACKEND_URL + "/chemicals" );

        setChemicals( await response.json() );
    }


    const handleOnInputChange = (value:string) => {

        setShowInfos( false );

        setInput( value );
	};


    const showLastCalculation = () => {

        // TODO: implement
    }


    const calculate = () => {

        setShowInfos( true );

        fetchChemicalInfos();
        fetchResult();
    }


    const fetchChemicalInfos = async () => {

        // TODO: error handling
        
        setChemicalInfoIsLoading( true );

        const response = await fetch( `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastidentity/smiles/${input}/JSON` );

        const json = await response.json();

        const properties = json.PC_Compounds[0].props;

        const chemicalInfo:any = {};

        properties.forEach((child:any) => {
            if( child.urn.label === "IUPAC Name" && child.urn.name === "Preferred" )
                chemicalInfo.IUPACName = child.value.sval;
            else if( child.urn.label === "Molecular Formula" )
                chemicalInfo.MolecularFormula = child.value.sval;
            else if( child.urn.label === "Molecular Weight" )
                chemicalInfo.MolecularWeight = child.value.fval;
            else if( child.urn.label === "InChI" )
                chemicalInfo.InChI = child.value.sval;
            else if( child.urn.label === "InChIKey" )
                chemicalInfo.InChIKey = child.value.sval;
        });

        setChemicalInfoIsLoading( false );

        setChemicalInfo( chemicalInfo );
    }


    const fetchResult = async () => {

        setResultIsLoading( true );

        // TODO: implement
        // const response = await fetch( BACKEND_URL + "/chemicals/" + input, { method: "POST" });
        // const json = await response.json();

        setResultIsLoading( false );
        setResult( "ANTWORT VOM SERVER" );
    }


    return (
        <Paper className="paper">
		    <div className={classes.row}>
		        <Autocomplete freeSolo options={chemicals} className={classes.textField} onChange={(e:any, value:any) => { if(value != null) handleOnInputChange(value.smiles); }} getOptionLabel={(option:any) => option.smiles} renderInput={(params) => <TextField {...params} placeholder="SMILES" variant="outlined" onChange={(e:any) => handleOnInputChange(e. target.value)} />} />
		        <Button variant="contained" color="primary" className={classes.button} onClick={showLastCalculation}><SvgIcon>{KeyboardArrowDownIcon}</SvgIcon></Button>
		        <Button variant="contained" color="primary" className={classes.button} onClick={calculate}><SvgIcon>{SearchIcon}</SvgIcon></Button>
		    </div>
            {showInfos &&
            <div>
                <Typography variant="h6" className={classes.heading}>Struktur</Typography>
                <canvas id="smiles-drawer" />

                <Typography variant="h6" className={classes.heading}>Identifizierer und Eigenschaften</Typography>
                {chemicalInfoIsLoading && <CircularProgress />}
                {!chemicalInfoIsLoading &&
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                                <TableCell className={classes.trLeft}>IUPAC Name</TableCell>
                                <TableCell className={classes.trRight}>{chemicalInfo.IUPACName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.trLeft}>Chemische Formel</TableCell>
                                <TableCell className={classes.trRight}>{chemicalInfo.MolecularFormula}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.trLeft}>Molekülmasse</TableCell>
                                <TableCell className={classes.trRight}>{chemicalInfo.MolecularWeight} g/mol</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.trLeft}>InChI</TableCell>
                                <TableCell className={classes.trRight}>{chemicalInfo.InChI}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={`${classes.trLeft} ${classes.noBorder}`}>InChIKey</TableCell>
                                <TableCell className={`${classes.trRight} ${classes.noBorder}`}>{chemicalInfo.InChIKey}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>}

                <Typography variant="h6" className={classes.heading}>Ergebnis</Typography>
                {resultIsLoading && <CircularProgress />}
                {!resultIsLoading && <span>{result}</span>}
            </div>
            }
		</Paper>
	);
}


export default Home;