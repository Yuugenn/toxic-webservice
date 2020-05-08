import React from 'react';
import '../App.css';
import {makeStyles} from '@material-ui/styles';
import {Theme} from '@material-ui/core';
import Content from './Content';
import NavigationBar from './NavigationBar';


const useStyles = makeStyles((theme: Theme) => ({

	container: {
		display: 'flex',
		flexDirection: 'column',
	}
}));


function App() {

	const classes = useStyles();

	return (
		<div className={classes.container}>
			<NavigationBar />
			<Content />
		</div>
	);
}


export default App;