import {makeStyles, Theme} from "@material-ui/core";
import {Button, CircularProgress, Link, Paper, TextField} from "@material-ui/core";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {BACKEND_URL} from "../config";


const useStyles = makeStyles((theme:Theme) => ({

    circularProgress: {
        margin: "auto"
    },
    form: {
        display: "flex",
        flexDirection: "column"
    },
    label: {
        display: "flex",
        justifyContent: "space-between"
    },
    textField: {
		flex: "1",
        marginTop: "12px",
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

    const [email,         setEmail        ] = useState<string>( "" );
    const [emailError,    setEmailError   ] = useState<boolean>( false );
    const [password,      setPassword     ] = useState<string>( "" );
    const [passwordError, setPasswordError] = useState<boolean>( false );
    const [loginError,    setLoginError   ] = useState<string>( "" );
    const [isLoading,     setLoading      ] = useState<boolean>( false );


    const isFormCorrect = () => {

        let isCorrect:boolean = true;

        if( email == "" ) {
            setEmailError( true );
            isCorrect = false;
        } else
            setEmailError( false );

        if( password == "" ) {
            setPasswordError( true );
            isCorrect = false;
        } else
            setPasswordError( false );

        return isCorrect;
    }


	const login = async (event:any) => {

        // prevent reload of the site (form submit)
        event.preventDefault();

        if( ! isFormCorrect() )
            return;

        setLoginError( "" );
        setLoading( true );

        const body = {
            "email": email,
            "password": password
        };

        const response = await fetch( BACKEND_URL + "/login", { method: "POST", body: JSON.stringify(body) } );

        if( response.status == 401 ) {
            setLoading( false );
            setLoginError( "E-Mail oder Passwort falsch!" );
        } else {
            const data = await response.json();
            history.push( `/home/${data.token}` );
        }
    };


    return (
        <Paper className="paper">
            {isLoading ? <CircularProgress className={classes.circularProgress} /> :
            <form className={classes.form} onSubmit={login}>
                <div className={classes.label}>
                    <span>E-Mail</span>
                    <Link href="/register">Register</Link>
                </div>
                <TextField variant="outlined" className={classes.textField} value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
                <div className={classes.label}>
                    <span>Password</span>
                </div>
                <TextField variant="outlined" className={classes.textField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={passwordError} />
                {loginError && (<p className={classes.error}>{loginError}</p>)}
                <div>
                    <Button variant="contained" color="primary" type="submit">Login</Button>
                    {isLoading && (<CircularProgress />)}
                </div>
            </form>}
        </Paper>
    );
}


export default Login;
