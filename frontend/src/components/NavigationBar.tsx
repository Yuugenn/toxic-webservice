import {AppBar, IconButton, makeStyles, Theme, Toolbar, Typography} from '@material-ui/core';
import React from 'react';
import {useHistory} from "react-router-dom";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import WarningIcon from '@material-ui/icons/Warning';


const useStyles = makeStyles((theme: Theme) => ({

	toolbar: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	brand: {
		display: 'flex',
		alignItems: 'center'
	},
	logo: {
		marginRight: theme.spacing(2)
	},
	iconButton: {
		color: 'white'
	}
}));


function NavigationBar( props:any ) {

	const history = useHistory();
	const classes = useStyles();


	const logout = () => {

		history.push( `/login` );
	}


	return (
        <AppBar position="sticky" color="primary">
            <Toolbar className={classes.toolbar}>
				<div className={classes.brand}>
                	<WarningIcon className={classes.logo} />
                	<Typography variant="h6">Toxic Webapp</Typography>
				</div>
				{props.logout ? <IconButton className={classes.iconButton} onClick={logout}><ExitToAppIcon /></IconButton> : ""}
            </Toolbar>
        </AppBar>
	);
}


export default NavigationBar;