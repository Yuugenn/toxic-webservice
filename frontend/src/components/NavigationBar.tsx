import {AppBar, makeStyles, Theme, Toolbar, Typography, Button} from '@material-ui/core';
import React from 'react';
import {useHistory} from 'react-router-dom';
import WarningIcon from '@material-ui/icons/Warning';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
	},
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
	const history = useHistory();

	function handleLogoClick(): void {
		history.push('/');
	}
	function handleUploadClick(): void {
		history.push('/upload');
	}

	return (
		<div className={classes.root}>
			<AppBar
				position="sticky"
				color="primary"
			>
				<Toolbar>
					<Button className={classes.title} disableRipple onClick={handleLogoClick}>
						<WarningIcon className={classes.logo}/>
						<Typography variant="h6">
							Toxic Webapp
						</Typography>
					</Button>
					<Button className={classes.button} onClick={handleUploadClick}>
						<CloudUploadIcon/>
					</Button>
				</Toolbar>
			</AppBar>
		</div>
	);
}

export default NavigationBar;
