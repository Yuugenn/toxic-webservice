import {makeStyles, Theme} from "@material-ui/core";
import {Button, CircularProgress, Paper, TextField} from "@material-ui/core";
import React, {useState} from "react";
import {useHistory} from "react-router-dom";
import {BACKEND_URL} from "../config";
import NavigationBar from "./NavigationBar";


const useStyles = makeStyles((theme:Theme) => ({

    circularProgress: {
        margin: "auto"
    },
    form: {
        display: "flex",
        flexDirection: "column"
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

    const [kNumber,       setKNumber      ] = useState<string>( "" );
    const [kNumberError,  setKNumberError ] = useState<boolean>( false );
    const [password,      setPassword     ] = useState<string>( "" );
    const [passwordError, setPasswordError] = useState<boolean>( false );
    const [loginError,    setLoginError   ] = useState<string>( "" );
    const [isLoading,     setLoading      ] = useState<boolean>( false );


    const isFormCorrect = () => {

        let isCorrect:boolean = true;

        if( kNumber == "" ) {
            setKNumberError( true );
            isCorrect = false;
        } else
            setKNumberError( false );

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

        const formData = new FormData();
              formData.append( "username", kNumber );
              formData.append( "password", password );

        const response = await fetch( BACKEND_URL + "/login", { method: "POST", body: formData } );

        if( response.status == 401 ) {
            setLoading( false );
            setLoginError( "K-Number or password wrong!" );
        } else {
            const data = await response.json();
            history.push( `/home/${data.access_token}` );
        }
    };


    const handleOnChangeKNumberTextField = (event:any) => {

        setKNumber( event.target.value );
        setKNumberError( false );
    }


    const handleOnChangePasswordTextField = (event:any) => {

        setPassword( event.target.value );
        setPasswordError( false );
    }


    return (<>
        <NavigationBar logout={false} />
        <Paper className="paper">
            <form className={classes.form} onSubmit={login}>
                <span>K-Number</span>
                <TextField variant="outlined" className={classes.textField} value={kNumber} onChange={handleOnChangeKNumberTextField} error={kNumberError} />
                <span>Password</span>
                <TextField variant="outlined" className={classes.textField} type="password" value={password} onChange={handleOnChangePasswordTextField} error={passwordError} />
                {loginError && (<p className={classes.error}>{loginError}</p>)}
                <div>
                    {isLoading ? <CircularProgress /> : <Button variant="contained" color="primary" type="submit">Login</Button>}
                </div>
            </form>
        </Paper>
    </>);
}


export default Login;
