import React, { Component } from 'react'
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer} from 'recharts'
import PropTypes from 'prop-types'

export class MainGraph extends Component {
    state = {
        count: 0,
        dots: []
    }

    // combines data from both lines to one structure 
    getCombinedData = () => {
        var graphData = []
        if (this.props.actual) {
            if (this.props.level !== 'Ad') {
                for (var i = (this.props.predicted.length - 10); i < this.props.predicted.length; i++) {
                    if (i < this.props.actual.length) {
                        graphData.push({
                            'Day': this.props.predicted[i]['x'],
                            'Predicted': this.props.predicted[i]['y'],
                            'Current': this.props.actual[i]['y']
                        })
                    } else {
                        graphData.push({
                            'Day': this.props.predicted[i]['x'],
                            'Predicted': this.props.predicted[i]['y'],
                            'Current': null
                        })
                    }
                }
            }
        }
        return graphData
    }

    showLive = () => {
        const current = this.props.current
        var graphData = [], count = 0
        let month = ''
        let day = ''
        if(current[0]) {
            if (current.length >= 8) {
                current.map(coordinate => {
                    if (coordinate.x > current.length-9) {
                        switch (coordinate.day.substring(6, 7)) {
                            case('0') : day = coordinate.day.substring(7); break
                            default : day = coordinate.day.substring(6); break
                        }
                        switch(coordinate.day.substring(3,5)) {
                            case('01') : month = 'Jan '; break
                            case('02') : month = 'Feb '; break
                            case('03') : month = 'Mar '; break
                            case('04') : month = 'Apr '; break
                            case('05') : month = 'May '; break
                            case('06') : month = 'Jun '; break
                            case('07') : month = 'Jul '; break
                            case('08') : month = 'Aug '; break
                            case('09') : month = 'Sept '; break
                            case('10') : month = 'Oct '; break
                            case('11') : month = 'Nov '; break
                            case('12') : month = 'Dec '; break  
                        }
                        graphData.push({
                            'Day': month + day,
                            'Predicted': null,
                            'Current': coordinate.y
                        })
                        count+=1
                    }
                })
            } else {
                current.map(coordinate => {
                    switch (coordinate.day.substring(6, 7)) {
                        case('0') : day = coordinate.day.substring(7); break
                        default : day = coordinate.day.substring(6); break
                    }
                    switch(coordinate.day.substring(3,5)) {
                        case('01') : month = 'Jan '; break
                        case('02') : month = 'Feb '; break
                        case('03') : month = 'Mar '; break
                        case('04') : month = 'Apr '; break
                        case('05') : month = 'May '; break
                        case('06') : month = 'Jun '; break
                        case('07') : month = 'Jul '; break
                        case('08') : month = 'Aug '; break
                        case('09') : month = 'Sept '; break
                        case('10') : month = 'Oct '; break
                        case('11') : month = 'Nov '; break
                        case('12') : month = 'Dec '; break  
                    }
                    graphData.push({
                        'Day': month + day,
                        'Predicted': null,
                        'Current': coordinate.y
                    })
                })
                count+=1
            }
        }
        return graphData
    }

    // Custom dot for actual line
    // TODO make dot automatically go to the last point
    displayDotActual = (e) => {
        let dot = 'dot-' + '0'
        if (this.state.count) {
            if (e.key === dot) {
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
        } else {
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
    showGraph = (data) => {
        if (this.props.level !== 'Ad') {
            return( 
                <div style={{width: '100%', margin: '0 auto', height: '100%', zIndex: 1}}>
                    <div style={legendStyle}>
                        <div style={legendModule}>
                            <div style={legendIconBlue}/>Current Purchases
                        </div>
                        <div style={legendModule}>
                            <div style={legendIconPurpleContainer}>
                                <div style={legendIconPurple}/>
                                <div style={legendIconPurple}/>
                            </div>28 Day Prediction
                        </div>
                    </div>
                    <ResponsiveContainer style={{zIndex: 3}}>
                        <AreaChart height={270} width={800} data={data}>
                            <CartesianGrid stroke='#f5f5f5'/>
                            <defs>
                                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="1%" stopColor="#A989FF" stopOpacity={1}/>
                                    <stop offset="85%" stopColor="#A989FF" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="1%" stopColor="#45C0E6" stopOpacity={1}/>
                                    <stop offset="85%" stopColor="#45C0E6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area dot={this.displayDotPredicted} type='monotone' dataKey='Predicted' stroke='#6648B7' fill='url(#colorUv)' strokeDasharray="9 5" strokeWidth={3}/>
                            <Area dot={this.displayDotActual} type='monotone' dataKey='Current' fill='url(#colorPv)' stroke='#55C2E8' strokeWidth={3}/>
                            <YAxis tick={{fill: '#A4A4A4', fontSize: 11 }} stroke={{}} domain={['auto', dataMax=>(dataMax*1.2)]}/>
                            <XAxis dataKey="Day" tick={{fill: '#A4A4A4', fontSize: 11}} stroke={{}} interval="preserveStartEnd" tickCount={6} width='110%'/>
                            <Tooltip labelFormatter={function(value) {return `Day: ${value}`}} labelStyle={{textAlign: 'center', fontWeight: 550}} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )
        }
    }

    render() {
        this.showLive()
        const data = this.props.currentActive ? this.showLive() : this.getCombinedData() 
        return (
            <div style={{width: '97%', margin: '0 auto', height: '45%', transform: 'translateX(-25px)'}}>
                {data.length !== 0 && this.showGraph(data)}
            </div>
        )
    }
}

const legendStyle = {
    fontSize: 13,
    color: '#A4A4A4',
    position: 'absolute', 
    display: 'flex',
    textAlign: 'left',
    transform: 'translate(57px, -15px)',
    zIndex: 2
}
const legendModule = {
    paddingLeft: 15,
    display: 'flex',
    alignItems: 'baseline'
}
const legendIconBlue= {
    width: 22,
    height: 6,
    borderRadius: 5,
    background: '#45C0E6',
    transform: 'translate(-5px, -2px)',
}
const legendIconPurpleContainer = {
    display: 'flex',
    width: 22,
    justifyContent: 'space-between'
}
const legendIconPurple = {
    width: 10,
    height: 6,
    borderRadius: 2,
    background: '#6648B7',
    transform: 'translate(-5px, -2px)'
}

MainGraph.propTypes = {
    actual: PropTypes.array,
    predicted: PropTypes.array,
    level: PropTypes.string.isRequired
}

export default MainGraph
