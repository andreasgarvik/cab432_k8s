import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions'
import M from 'materialize-css'
import Loader from './Loader'

class SearchBar extends React.Component {
	state = { search: '', loader: false }

	componentDidMount = () => {
		M.AutoInit()
	}

	handleChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		})
	}

	handleSubmit = e => {
		e.preventDefault()
		this.setState({ loader: true })
		this.props.connectStream(this.state.search)
	}

	render() {
		return (
			<>
				<form
					onSubmit={this.handleSubmit}
					className='white'
					style={{ marginTop: '2%' }}
				>
					<div className='input-field'>
						<i className='material-icons prefix'>search</i>
						<input
							type='text'
							id='search'
							maxLength='100'
							placeholder='Enter a search term'
							onChange={this.handleChange}
						/>
					</div>
					<button
						className={`right btn grey z-depth-0 btn-floating btn-large ${
							!this.state.search ? 'disabled' : ''
						}`}
					>
						<i className='material-icons'>search</i>
					</button>
				</form>
				<button
					className={`btn grey z-depth-0 btn-floating btn-large ${
						!this.state.loader ? 'disabled' : ''
					}`}
					onClick={this.props.disconnectStream}
				>
					<i className='material-icons'>pause</i>
				</button>
				{this.state.loader && this.props.twitter === 'connected' ? (
					<Loader />
				) : null}
			</>
		)
	}
}

const mapStateToProps = ({ twitter }) => {
	return { twitter }
}

export default connect(
	mapStateToProps,
	actions
)(SearchBar)
