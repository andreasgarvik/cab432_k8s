import React from 'react'
import { Router, Switch, Route, Redirect } from 'react-router-dom'
import history from '../config/history'
import ScrollToTop from '../config/ScrollToTop'
import Navbar from './Navbar'
import Footer from './Footer'
import HomeScreen from './Homescreen'

const App = () => {
	return (
		<Router history={history}>
			<ScrollToTop>
				<div className='App Site'>
					<Navbar />
					<div className='Site-content'>
						<div className='main'>
							<Switch>
								<Route exact path='/' component={HomeScreen} />
								<Redirect to='/' />
							</Switch>
						</div>
					</div>
					<Footer />
				</div>
			</ScrollToTop>
		</Router>
	)
}

export default App
