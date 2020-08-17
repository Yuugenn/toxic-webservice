import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/styles";
import Home from './Home';
import Login from './Login';


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
			    <Route exact path="/login">
                    <Login/>
                </Route>
				<Route path="/home/:token">
					<Home/>
				</Route>
				<Route path="/" render={() => (<Redirect to="/login" />)} />
			</Switch>
		</div>
	);
}


export default Content;