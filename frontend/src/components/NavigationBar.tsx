import {AppBar, makeStyles, Theme, Toolbar, Typography, Button} from '@material-ui/core';
import React from 'react';
import WarningIcon from '@material-ui/icons/Warning';


const useStyles = makeStyles((theme: Theme) => ({

	title: {
		color: 'inherit',
		textTransform: 'none',
	},
	button: {
		color: 'inherit',
	},
	logo: {
		marginRight: theme.spacing(2),
	},
}));


function NavigationBar() {

	const classes = useStyles();

	return (
        <AppBar position="sticky" color="primary">
            <Toolbar>
                <WarningIcon className={classes.logo} />
                <Typography variant="h6">Toxic Webapp</Typography>
            </Toolbar>
        </AppBar>
	);
}


export default NavigationBar;