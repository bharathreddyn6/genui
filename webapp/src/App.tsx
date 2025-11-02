import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './views/landing';
import AppWrapper from './views/app-wrapper';

function App() {
	return (
		<main className="App">
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/app/*" element={<AppWrapper />} />
				</Routes>
			</BrowserRouter>
		</main>
	);
}

export default App;
