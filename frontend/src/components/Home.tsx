import {Button} from "@material-ui/core";
import React, {useState} from "react";
import {BACKEND_URL} from "../config";


function Home() {
	const [message, setMessage] = useState<string>('');
	const [error, setError] = useState<string>('');

	const getMessage = () => {
		fetch(BACKEND_URL)
			.then((response) => response.json())
			.then(data => {
				if (data.message) {
					setMessage(data.message);
				} else {
					setError(`Failed to get message from ${data}`);
				}
			})
			.catch(error => setError(error));
	};
    
	return (
		<div>
			<Button
				variant="contained"
				color="primary"
				onClick={getMessage}
			>
				Request
			</Button>
			<div>
				{message && (
					<p>
						<code>
							{message}
						</code>
					</p>
				)}
				{error && (
					<p>
						Error:
						<code>
							{error}
						</code>
					</p>
				)}
			</div>
		</div>
	);
}

export default Home;
