import {makeStyles, Theme} from "@material-ui/core";
import {Button, CircularProgress, Paper, TextField} from "@material-ui/core";
import React, {useState} from "react";
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


function Register() {

    const classes = useStyles();

    const [firstName,               setFirstName              ] = useState<string>( "" );
    const [firstNameError,          setFirstNameError         ] = useState<boolean>( false );
    const [lastName,                setLastName               ] = useState<string>( "" );
    const [lastNameError,           setLastNameError          ] = useState<boolean>( false );
    const [organisation,            setOrganisation           ] = useState<string>( "" );
    const [email,                   setEmail                  ] = useState<string>( "" );
    const [emailError,              setEmailError             ] = useState<boolean>( false )
    const [password,                setPassword               ] = useState<string>( "" );
    const [passwordError,           setPasswordError          ] = useState<boolean>( false );
    const [passwordRepetition,      setPasswordRepetition     ] = useState<string>( "" );
    const [passwordRepetitionError, setPasswordRepetitionError] = useState<boolean>( false );
    const [registerError,           setRegisterError          ] = useState<string>( "" );
    const [isLoading,               setLoading                ] = useState<boolean>( false );


    const isFormCorrect = () => {

        let isCorrect:boolean = true;

        if( firstName == "" ) {
            setFirstNameError( true );
            isCorrect = false;
        } else
            setFirstNameError( false );

        if( lastName == "" ) {
            setLastNameError( true );
            isCorrect = false;
        } else
            setLastNameError( false );

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

        if( passwordRepetition == "" ) {
            setPasswordRepetitionError( true );
            isCorrect = false;
        } else
            setPasswordRepetitionError( false );

        if( password != passwordRepetition ) {
            setPasswordError( true );
            setPasswordRepetitionError( true );
            isCorrect = false;
        }

        return isCorrect;
    }


    const register = async (event:any) => {

        // prevent reload of the site (form submit)
        event.preventDefault();

        if( ! isFormCorrect() )
            return;

        setRegisterError( "" );
        setLoading( true );

        const body = {
            "firstName": firstName,
            "lastName": lastName,
            "organisation": organisation,
            "email": email,
            "password": password
        };

        const response = await fetch( BACKEND_URL + "/register", { method: "POST", body: JSON.stringify(body) } );

        const data = await response.json();

        // TODO: change on completed backend
    };


    return (
        <Paper className="paper">
            {isLoading ? <CircularProgress className={classes.circularProgress} /> :
            <form className={classes.form} onSubmit={register}>
                <span className={classes.label}>Vorname *</span>
                <TextField variant="outlined" className={classes.textField} value={firstName} onChange={(e) => setFirstName(e.target.value)} error={firstNameError} />
                <span className={classes.label}>Nachname *</span>
                <TextField variant="outlined" className={classes.textField} value={lastName} onChange={(e) => setLastName(e.target.value)} error={lastNameError} />
                <span className={classes.label}>Organisation</span>
                <TextField variant="outlined" className={classes.textField} value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
                <span className={classes.label}>E-Mail *</span>
                <TextField variant="outlined" className={classes.textField} value={email} onChange={(e) => setEmail(e.target.value)} error={emailError} />
                <span className={classes.label}>Passwort *</span>
                <TextField variant="outlined" className={classes.textField} type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={passwordError} />
                <span className={classes.label}>Passwort wiederholen *</span>
                <TextField variant="outlined" className={classes.textField} type="password" value={passwordRepetition} onChange={(e) => setPasswordRepetition(e.target.value)} error={passwordRepetitionError} />
                {registerError && (<p className={classes.error}>{registerError}</p>)}
                <div>
                    <Button variant="contained" color="primary" type="submit">Registrieren</Button>
                    {isLoading && (<CircularProgress />)}
                </div>
            </form>}
        </Paper>
    );
}


export default Register;
