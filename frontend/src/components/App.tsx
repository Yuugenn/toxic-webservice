import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import '../App.css';
import Login from "./Login";
import Home from "./Home";


function App() {

	return (
		<Switch>
			<Route exact path="/login">
				<Login/>
			</Route>
			<Route path="/home/:accessToken">
				<Home/>
			</Route>
			<Route path="/" render={() => (<Redirect to="/login" />)} />
		</Switch>
	);
}


export default App;