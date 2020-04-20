import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import './index.css';
import App from './components/App';
import Theming from './components/Theming';

ReactDOM.render(
	<Theming>
		<Router>
			<App/>
		</Router>
	</Theming>,
	document.getElementById('root'),
);
