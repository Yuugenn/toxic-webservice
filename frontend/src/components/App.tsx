import React from 'react';
import '../App.css';
import {makeStyles} from '@material-ui/styles';
import {Theme} from '@material-ui/core';
import Content from './Content';
import NavigationBar from './NavigationBar';

const useStyles = makeStyles((theme: Theme) => ({
	container: {
		display: 'flex',
		height: '100vh',
		flexDirection: 'column',
	},
	content: {
		flex: 1,
		padding: theme.spacing(2),
	}
}));

function App() {
	const classes = useStyles();

	return (
		<div className={classes.container}>
			<NavigationBar/>
			<div className={classes.content}>
				<Content/>
			</div>
		</div>
	);
}

export default App;
