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
		let data = {
			labels: ['Positive', 'Negative'],
			datasets: [
				{
					label: 'Sentiment',
					backgroundColor: ['rgba(60, 186, 84, 0.2)', 'rgba(219, 50, 54, 0.2)'],
					borderColor: ['rgba(60, 186, 84, 1)', 'rgba(219, 50, 54, 1)'],
					data: [0, 0]
				}
			]
		}
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
				datasets: [{ data: [positive, negative] }]
			}
		}
		return data
	}

	renderChartGoogle = () => {
		const result = this.props.twitter.result
		let data = {
			labels: ['Positive', 'Negative'],
			datasets: [
				{
					label: 'Google',
					backgroundColor: ['rgba(60, 186, 84, 0.2)', 'rgba(219, 50, 54, 0.2)'],
					borderColor: ['rgba(60, 186, 84, 1)', 'rgba(219, 50, 54, 1)'],
					data: [0, 0]
				}
			]
		}
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
				datasets: [{ data: [positive, negative] }]
			}
		}
		return data
	}

	render() {
		const { result, error } = this.props.twitter
		return (
			<div>
				<div>
					Seen values:
					{this.props.searched.map(term => term).join(', ')}
				</div>
				<div>
					<Doughnut data={this.renderChartScore} />
				</div>
				<div>
					<Doughnut data={this.renderChartGoogle} />
				</div>
				{!error ? (
					result ? (
						<>
							<div>
								Topics in the tweets:
								{result.map(tweet =>
									tweet.topics.map(t => t.normal).join(', ')
								)}
							</div>
							<ul class='collection with-header'>
								<li class='collection-header'>
									<h4>Tweets</h4>
								</li>
								{result.map(tweet => (
									<li class='collection-item'>{tweet.text}</li>
								))}
							</ul>
						</>
					) : null
				) : (
					<div
						class='card-panel red'
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
						<span class='white-text'>{error}</span>
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
