import {makeStyles} from '@material-ui/core';
import {Button, CircularProgress, FormControl, MenuItem, Paper, Select, SvgIcon, Table, TableBody, TableCell, TableRow, TextField, Typography} from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {BACKEND_URL} from "../config";
import NavigationBar from "./NavigationBar";

// not working: import SmilesDrawer from "smiles-drawer";
const SmilesDrawer = require("smiles-drawer");


const useStyles = makeStyles((theme) => ({

  row: {
      display: "flex"
  },
  textField: {
      flex: 1
  },
  algorithm: {
      marginLeft: "16px",
      marginRight: "16px"
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

    // SearchIcon via material-ui/icons throws errors, so manually with svg path
    const SearchIcon = <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />;

    const history = useHistory();
    const classes = useStyles();

    const { accessToken } = useParams();

    const [token,                 setToken                ] = useState<string>( "" );
    const [input,                 setInput                ] = useState<string>( "" );
    const [lastSearchTerms,       setLastSearchTerms      ] = useState<string[]>( [] );
    const [selectedAlgorithm,     setSelectedAlgorithm    ] = useState<string>( "CNB" );
    const [showInfos,             setShowInfos            ] = useState<boolean>( false );
    const [chemicalInfo,          setChemicalInfo         ] = useState<any>( {} );
    const [chemicalInfoIsLoading, setChemicalInfoIsLoading] = useState<boolean>( false );
    const [result,                setResult               ] = useState<string>( "" );
    const [resultIsLoading,       setResultIsLoading      ] = useState<boolean>( false );


    useEffect(() => {  // equivalent to componentDidMount

        setToken( accessToken );
    }, [accessToken]);


    useEffect(() => {  // equivalent to componentDidUpdate

        // the smiles cannot be drawn in calculate because the canvas
        // is not rendered at that time

        const smilesDrawer = new SmilesDrawer.Drawer({ height: 300, width: 500 });

        SmilesDrawer.parse(input, function(tree:any) {
            smilesDrawer.draw(tree, "smiles-drawer", "light", false);
        });
    }, [input, showInfos]);


    const handleOnInputChange = (value:string) => {

        setShowInfos( false );

        setInput( value );
	};


    const fetchInfos = async () => {

        if( input === "" )
        {
            return;
        }

        await checkIfAuthorized();

        if( ! lastSearchTerms.includes(input) )
        {
            lastSearchTerms.push( input );

            setLastSearchTerms( lastSearchTerms );
        }

        setShowInfos( true );

        fetchChemicalInfos();
        fetchToxicState();
    }


    const checkIfAuthorized = async () => {

        const headers = new Headers();
              headers.append( "Authorization", `Bearer ${token}` );

        const response = await fetch( `${BACKEND_URL}/login/refresh`, { headers: headers });

        if( response.status === 401 )
            history.push( `/login` );
        else
            setToken( (await response.json()).access_token )
    }


    const fetchChemicalInfos = async () => {

        setChemicalInfoIsLoading( true );

        const response = await fetch( `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/fastidentity/smiles/${input}/JSON` );

        if( response.status !== 200 )
        {
            setChemicalInfo( "Error!" );
            setChemicalInfoIsLoading( false );
            return;
        }

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

        setChemicalInfo( chemicalInfo );
        setChemicalInfoIsLoading( false );
    }


    const fetchToxicState = async () => {

        setResultIsLoading( true );

        const headers = new Headers();
              headers.append( "Authorization", `Bearer ${token}` );

        const response = await fetch( `${BACKEND_URL}/chemicals/smiles/${input}?model=${selectedAlgorithm}`, { method: "POST", headers: headers });

        if( response.status !== 200 )
        {
            setResult( "Error!" );
            setResultIsLoading( false );
            return;
        }

        const result = await response.json();

        setResultIsLoading( false );

        if( result.chemical.label === 0 && result.chemical.predicted === false )
            setResult( "Chemical is known and not toxic!" );
        else if( result.chemical.label === 0 && result.chemical.predicted === true )
            setResult( "Chemical is not known and were predicted as not toxic!" );
        else if( result.chemical.label === 1 && result.chemical.predicted === false )
            setResult( "Chemical is known and toxic!" );
        else if( result.chemical.label === 1 && result.chemical.predicted === true )
            setResult( "Chemical is not known and were predicted as toxic!" );
    }


    const onLogoClick = () => {

        handleOnInputChange( "" );

        setSelectedAlgorithm( "CNB" );
    }


    return(<>
        <NavigationBar logout={true} onLogoClick={onLogoClick} />
        <Paper className="paper">
		    <div className={classes.row}>
		        <Autocomplete freeSolo options={lastSearchTerms} className={classes.textField} onChange={(e:any, value:any) => { if(value != null) handleOnInputChange(value); }} value={input} renderInput={(params) => <TextField {...params} placeholder="SMILES" variant="outlined" value={input} onChange={(e:any) => handleOnInputChange(e.target.value)} />} />
                <FormControl variant="outlined" className={classes.algorithm}>
                    <Select value={selectedAlgorithm} onChange={(e:any) => setSelectedAlgorithm(e.target.value)}>
                        <MenuItem value={"CNB"}>Complement Naive Bayes</MenuItem>
                        <MenuItem value={"GNB"}>Gaussian Naive Bayes</MenuItem>
                    </Select>
                </FormControl>
		        <Button variant="contained" color="primary" onClick={fetchInfos}><SvgIcon>{SearchIcon}</SvgIcon></Button>
		    </div>
            {showInfos &&
            <div>
                <Typography variant="h6" className={classes.heading}>Structure</Typography>
                <canvas id="smiles-drawer" />

                <Typography variant="h6" className={classes.heading}>Properties</Typography>
                {chemicalInfoIsLoading ? <CircularProgress /> : (chemicalInfo === "Error!") ? <span>{chemicalInfo}</span> :
                    <Table className={classes.table}>
                        <TableBody>
                            <TableRow>
                                <TableCell className={classes.trLeft}>IUPAC Name</TableCell>
                                <TableCell className={classes.trRight}>{chemicalInfo.IUPACName}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.trLeft}>Molecular Formula</TableCell>
                                <TableCell className={classes.trRight}>{chemicalInfo.MolecularFormula}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className={classes.trLeft}>Molecular Weight</TableCell>
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

                <Typography variant="h6" className={classes.heading}>Result</Typography>
                {resultIsLoading ? <CircularProgress /> : <span>{result}</span>}
            </div>
            }
		</Paper>
	</>);
}


export default Home;