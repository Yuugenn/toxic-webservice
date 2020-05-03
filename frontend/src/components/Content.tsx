import React from 'react';
import {Route, Switch} from "react-router-dom";
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
			    <Route exact path={["/", "/login"]}>
                    <Login/>
                </Route>
				<Route exact path="/home">
					<Home/>
				</Route>
			</Switch>
		</div>
	);
}


export default Content;