import React from 'react'

const Footer = () => {
	return (
		<footer className='page-footer blue-grey'>
			<div className='container'>
				<div className='row'>
					<div className='col s6'>Tweets from realtime</div>
					<div className='col s6 right-align'>Analysed by several APIs</div>
				</div>
			</div>
			<div className='footer-copyright'>
				<div className='container'>
					© 2019 Created by Andreas Garvik and Morten Helland
					<a
						className='grey-text text-lighten-4 right'
						href='https://github.com/andreasgarvik/cab432_k8s'
					>
						Github
					</a>
				</div>
			</div>
		</footer>
	)
}
export default Footer
