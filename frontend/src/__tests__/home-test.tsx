import React from 'react';
import renderer from 'react-test-renderer';
import Content from '../components/Content';

it('Content renders correctly', () => {
	const tree = renderer
		.create(<Content/>)
		.toJSON();
	expect(tree).toMatchSnapshot();
});