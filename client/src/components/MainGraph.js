import React, { Component } from 'react'
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer} from 'recharts'
import PropTypes from 'prop-types'

export class MainGraph extends Component {
    // combines data from both lines to one structure 
    getCombinedData = () => {
        var graphData = []
        if (this.props.level !== 'Ad') {
            for (var i = (this.props.predicted.length - 10); i < this.props.predicted.length; i++) {
                if (i < this.props.actual.length) {
                    graphData.push({
                        'Day': this.props.predicted[i]['x'],
                        'Predicted': this.props.predicted[i]['y'],
                        'Actual': this.props.actual[i]['y']
                    })
                } else {
                    graphData.push({
                        'Day': this.props.predicted[i]['x'],
                        'Predicted': this.props.predicted[i]['y'],
                        'Actual': null
                    })
                }
            }
            return graphData
        }
        return 0
    }

    // Custom dot for actual line
    // TODO make dot automatically go to the last point
    displayDotActual = (e) => {
        if (e.key === 'dot-7') {
            return (
                <circle 
                    key={e.key}
                    r={4}
                    cx={e.cx}
                    cy={e.cy}
                    stroke={e.stroke}
                    strokeWidth={2}
                    fill={'white'}
                />
            )
        }
    }

    // Custom dot for predicted line
    // TODO make last two dots automatically go to the last points
    displayDotPredicted = (e) => {
        if(e.key === 'dot-7' || e.key === 'dot-9') {
            return (
                <circle 
                    key={e.key}
                    r={4}
                    cx={e.cx}
                    cy={e.cy}
                    stroke={e.stroke}
                    strokeWidth={2}
                    fill={'white'}
                />
            )
        }
    }

    // shows graph until the object displayed is at the ad level
    showGraph = () => {
        const data = this.getCombinedData()
        if (this.props.level !== 'Ad') {
            return( 
                <div style={{width: '100%', margin: '0 auto', height: '100%'}}>
                    <ResponsiveContainer>
                        <AreaChart height={270} width={800} data={data}>
                            <CartesianGrid stroke='#f5f5f5'/>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="1%" stopColor="#6648B7" stopOpacity={0.8}/>
                                    <stop offset="85%" stopColor="#6648B7" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="1%" stopColor="#55C2E8" stopOpacity={0.8}/>
                                    <stop offset="85%" stopColor="#55C2E8" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area dot={this.displayDotPredicted} type='monotone' dataKey='Predicted' stroke='#6648B7' fill='url(#colorUv)' strokeDasharray="5 5" strokeWidth={3}/>
                            <Area dot={this.displayDotActual} type='monotone' dataKey='Actual' fill='url(#colorPv)' stroke='#55C2E8' strokeWidth={3}/>
                            <YAxis tick={{fill: '#A4A4A4', fontSize: 11 }} stroke={{}}/>
                            <XAxis dataKey="Day" tick={{fill: '#A4A4A4', fontSize: 11}} stroke={{}} interval={0} />
                            <Tooltip labelFormatter={function(value){return `Day: ${value}`}} labelStyle={{textAlign: 'center', fontWeight: 550}}/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )
        }
    }

    render() {
        return (
            <div style={{width: '97%', margin: '0 auto', height: '45%', transform: 'translateX(-25px)'}}>
                {this.showGraph()}
            </div>
        )
    }
}

MainGraph.propTypes = {
    actual: PropTypes.array,
    predicted: PropTypes.array,
    level: PropTypes.string.isRequired
}

export default MainGraph
