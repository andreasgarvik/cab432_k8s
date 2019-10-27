import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../store/actions'
import { Doughnut } from 'react-chartjs-2'

class Dashboard extends React.Component {
	componentDidMount = () => {
		this.props.searchedTerms()
	}

	renderChartScore = () => {
		const result = this.props.twitter.result
		let data = {}
		if (result) {
			let positive = 0
			let negative = 0
			result.forEach(r => {
				if (r.score.score > 0) {
					positive++
				} else if (r.score.score < 0) {
					negative++
				} else {
					return
				}
			})
			data = {
				labels: ['Positive', 'Negative'],
				datasets: [
					{
						label: 'Sentiment',
						backgroundColor: [
							'rgba(60, 186, 84, 0.2)',
							'rgba(219, 50, 54, 0.2)'
						],
						borderColor: ['rgba(60, 186, 84, 1)', 'rgba(219, 50, 54, 1)'],
						data: [positive, negative]
					}
				]
			}
		}
		return data
	}

	renderChartGoogle = () => {
		const result = this.props.twitter.result
		let data = {}
		if (result) {
			let positive = 0
			let negative = 0
			result.forEach(r => {
				if (r.google.score > 0) {
					positive++
				} else if (r.google.score < 0) {
					negative++
				} else {
					return
				}
			})
			data = {
				labels: ['Positive', 'Negative'],
				datasets: [
					{
						label: 'Google',
						backgroundColor: [
							'rgba(60, 186, 84, 0.2)',
							'rgba(219, 50, 54, 0.2)'
						],
						borderColor: ['rgba(60, 186, 84, 1)', 'rgba(219, 50, 54, 1)'],
						data: [positive, negative]
					}
				]
			}
		}
		return data
	}

	render() {
		const { result, error } = this.props.twitter
		return (
			<div>
				<div>Searched: {this.props.searched.map(term => term).join(', ')}</div>
				{!error ? (
					result ? (
						<>
							<div className='row' style={{ marginTop: '4.6%' }}>
								<div class='col s12 m12 l6'>
									<h4 className='center-align'>Sentiment</h4>
									<Doughnut data={this.renderChartScore} />
								</div>
								<div class='col s12 m12 l6'>
									<h4 className='center-align'>Google Natural Language</h4>
									<Doughnut data={this.renderChartGoogle} />
								</div>
							</div>
							<ul className='collection with-header'>
								<li className='collection-header'>
									<h4>Tweets</h4>
								</li>
								{result.map(tweet => (
									<li className='collection-item'>{tweet.text}</li>
								))}
							</ul>
							<ul className='collection with-header'>
								<li className='collection-header'>
									<h4>Topics in the tweets</h4>
								</li>
								{result.map(tweet => {
									if (tweet.topics.length !== 0) {
										return (
											<li className='collection-item'>
												{tweet.topics.map(t => t.normal).join(', ')}
											</li>
										)
									} else {
										return null
									}
								})}
							</ul>
						</>
					) : null
				) : (
					<div
						className='card-panel red'
						style={{
							position: 'absolute',
							top: '0',
							left: '0',
							right: '0',
							bottom: '0',
							margin: 'auto',
							height: '70px',
							width: '400px',
							textAlign: 'center',
							zIndex: '-1'
						}}
					>
						<span className='white-text'>{error}</span>
					</div>
				)}
			</div>
		)
	}
}

const mapStateToProps = ({ searched, twitter }) => {
	return { searched, twitter }
}

export default connect(
	mapStateToProps,
	actions
)(Dashboard)
