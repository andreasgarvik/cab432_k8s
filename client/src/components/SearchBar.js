import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions'
import M from 'materialize-css'
import Loader from './Loader'

class SearchBar extends React.Component {
	state = { search: '', loader: false }

	componentDidMount = () => {
		this.props.flushStore()
		M.AutoInit()
	}

	handleChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		})
	}

	handleSubmit = e => {
		e.preventDefault()
		this.setState({ search: '', loader: true })
		this.props.flushTweets()
		this.props.connectStream(this.state.search)
		this.props.newSearch(this.state.search)
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
							value={this.state.search}
							maxLength='100'
							placeholder='Enter a search term'
							onChange={this.handleChange}
						/>
					</div>
					<button
						className={`right btn grey z-depth-0 btn-floating btn-large ${
							!this.state.search && this.state.loader ? 'disabled' : ''
						}`}
					>
						<i className='material-icons'>search</i>
					</button>
				</form>
				{this.state.loader && Object.keys(this.props.twitter).length === 0 ? (
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
