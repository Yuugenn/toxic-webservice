import {createMuiTheme, CssBaseline, Theme} from '@material-ui/core';
import {ThemeProvider} from '@material-ui/styles';
import React, {PropsWithChildren} from 'react';

function Theming({children}: PropsWithChildren<{}>) {
	const theme: Theme = createMuiTheme({
		palette: {
			primary: {
				main: 'rgba(9,93,101,0.97)',
			},
			error: {
				main: '#e0504e',
			},
		},
		spacing: 7,
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline/>
			{children}
		</ThemeProvider>
	);
}

export default Theming;