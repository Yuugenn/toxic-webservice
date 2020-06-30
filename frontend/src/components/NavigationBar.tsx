import {AppBar, IconButton, makeStyles, Theme, Toolbar, Typography} from '@material-ui/core';
import React from 'react';
import {matchPath} from 'react-router';
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


function NavigationBar() {

	const classes = useStyles();


	const logout = () => {

		// token must be parse manually from url, because useParams is not working

		let url:string = window.location.href;

		let token = url.match( /([^\/]+$)/g );

		// TODO: logout

		// if( token )
			// token[0]
	}


	return (
        <AppBar position="sticky" color="primary">
            <Toolbar className={classes.toolbar}>
				<div className={classes.brand}>
                	<WarningIcon className={classes.logo} />
                	<Typography variant="h6">Toxic Webapp</Typography>
				</div>
				{matchPath(window.location.pathname, {
					path: '/home/:token',
					exact: true
				}) ? <IconButton className={classes.iconButton} onClick={logout}><ExitToAppIcon /></IconButton> : ""}
            </Toolbar>
        </AppBar>
	);
}


export default NavigationBar;