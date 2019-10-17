import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions'

class App extends React.Component {
	componentDidMount = () => {
		this.props.connectStream()
	}

	disconnectStream = () => {
		this.props.disconnectStream()
	}

	analyseStream = () => {
		this.props.analyseStream()
	}
	render = () => {
		return (
			<div>
				<div>{JSON.stringify(this.props.twitter)}</div>
				<button onClick={this.disconnectStream}>Disconnect</button>
				<button onClick={this.analyseStream}>Analyse</button>
			</div>
		)
	}
}

const mapStateToProps = ({ twitter }) => {
	return { twitter }
}

export default connect(
	mapStateToProps,
	actions
)(App)
