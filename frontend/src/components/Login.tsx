import {makeStyles, Theme} from "@material-ui/core";
import {Button, CircularProgress, Paper, TextField} from "@material-ui/core";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {API_URL} from "../config";


const useStyles = makeStyles((theme:Theme) => ({

    form: {
        display: "flex",
        flexDirection: "column"
    },
    textField: {
		flex: "1",
		marginBottom: "24px"
	},
	error: {
	    color: "red",
	    marginTop: "0",
	    marginBottom: "24px"
	}
}));


function Login() {

    const history = useHistory();
    const classes = useStyles();

    const [email,     setEmail   ] = useState<string>( "" );
    const [password,  setPassword] = useState<string>( "" );
    const [error,     setError   ] = useState<string>( "" );
    const [isLoading, setLoading ] = useState<boolean>( false );


	const login = async (event:any) => {

        // prevent reload of the site (form submit)
        event.preventDefault();

        setError( "" );
        setLoading( true );

        const body = {
            "email": email,
            "password": password
        };

        // TODO: change on completed backend

        // const response = await fetch( API_URL + "login", { method: "POST", body: JSON.stringify(body) } );

        // const data = await response.json();

        // if( data.key !== undefined ) {

        if( email == "test@example.com" && password == "123456" ) {
            history.push( "/home" );
        } else {
            setLoading( false );
            setError( "Falsche E-Mail oder Passwort!" );
        }
    };


    return (
        <Paper className="paper">
            <form className={classes.form} onSubmit={login}>
                <TextField label="E-Mail"   variant="outlined" className={classes.textField}                 value={email}    onChange={(e) => setEmail(e.target.value)}    />
                <TextField label="Passwort" variant="outlined" className={classes.textField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && (<p className={classes.error}>{error}</p>)}
                <div>
                    <Button variant="contained" color="primary" type="submit">Anmelden</Button>
                    {isLoading && (<CircularProgress />)}
                </div>
            </form>
        </Paper>
    );
}


export default Login;
