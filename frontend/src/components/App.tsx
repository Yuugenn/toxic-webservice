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
	},
	content: {
		width: '50%',
		margin: '50px auto'
	}
}));


function App() {

	const classes = useStyles();

	return (
		<div className={classes.container}>
			<NavigationBar />
			<div className={classes.content}>
				<Content />
			</div>
		</div>
	);
}


export default App;