import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
	return (
		<div className='navbar'>
			<nav>
				<div className='nav-wrapper blue-grey'>
					<NavLink to='/' className='brand-logo center'>
						<i className='material-icons'>cloud</i>Twitter
					</NavLink>
				</div>
			</nav>
		</div>
	)
}

export default Navbar
