import React from 'react';
import {Route, Switch} from "react-router-dom";
import {Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import Home from './Home';


const useStyles = makeStyles((theme: Theme) => ({
	content: {
		height: '100%'
	}
}));

function Content () {
	const classes = useStyles();

	return (
		<div className={classes.content}>
			<Switch>
				<Route path="/upload">
					Upload
				</Route>
				<Route path="/">
					<Home/>
				</Route>
			</Switch>
		</div>
	);
}

export default Content;
