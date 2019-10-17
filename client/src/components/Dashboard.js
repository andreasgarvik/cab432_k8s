import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions'

class Dashboard extends React.Component {
	componentDidMount = () => {
		this.props.searchedTerms()
	}
	render() {
		return (
			<div>
				Seen values:
				{Object.keys(this.props.searched)
					.map(term => term)
					.join(', ')}
			</div>
		)
	}
}

const mapStateToProps = ({ searched }) => {
	return { searched }
}

export default connect(
	mapStateToProps,
	actions
)(Dashboard)
