import React, { Component } from 'react'
import {AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area, ResponsiveContainer} from 'recharts'
import MainDropdown from './MainDropdown'
import DateDropdown from './DateDropdown'
import PerformanceBar from './PerformanceBar'
import PropTypes from 'prop-types'

export class MainGraph extends Component {
    state = {
        timeRange: 'Last 7 Days',
        dots: []
    }

    changeTimeRange = (timeRange) => {
        this.setState({timeRange: timeRange})
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

    formatCoordinate = (coordinate) => {
        let month = ''
        let day = ''
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
        return month + day
    }

    getDateRange = (firstDate, upperLimit) => {
        let day = parseInt(firstDate.substring(6));
        let month = parseInt(firstDate.substring(3,5))
        let year = parseInt(firstDate.substring(0,2))
        let fillerDays = [], count = 0
        for (let i = upperLimit; i > 0; i--) {
            count++
            day--
            if (day === 0) {
                month--
                if (month === 0) {
                    month = 12; 
                    year--;
                }
                switch (true) {
                    case (month <= 6 && month % 2 === 0 && month !== 2) : day = 30; break
                    case (month <= 6 && month !== 2) : day = 31; break
                    case (month > 6 && month % 2 === 0) : day = 31; break
                    case (month > 6) : day = 30; break
                    case (month === 2 && year % 4 === 0) : day = 29; break 
                    default : day = 28; break
                }
                
            }
            fillerDays.push({
                'day': `${year}-${month}-${day}`,
                'y': 0
            })
        }
        return fillerDays.reverse()
    }

    showLive = () => {
        const current = this.props.current, currentLength = current.length
        const timeRange = this.state.timeRange
        let upperLimit, graphData = [];
        switch (timeRange) {
            case ('Last 7 Days') : upperLimit = 7; break
            case ('Last 14 Days') : upperLimit = 14; break
            case ('Last 28 Days') : upperLimit = 28; break
            case ('Last 2 Months') : upperLimit = 60; break
        }   
        if (current[0]) {
            if (currentLength >= upperLimit) {
                current.forEach(coordinate => {
                    if (coordinate.x >= currentLength - upperLimit) {
                        graphData.push({
                            'Day': this.formatCoordinate(coordinate),
                            'Predicted': null,
                            'Current': coordinate.y
                        })
                    }
                })
            } else {
                let adjusted = [...this.getDateRange(current[0].day, upperLimit-currentLength), ...current]
                adjusted.forEach(coordinate => {
                    graphData.push({
                        'Day': this.formatCoordinate(coordinate),
                        'Predicted': null,
                        'Current': coordinate.y
                    })
                })
            }
        }
        return graphData
    }

    // Custom dot for actual line
    // TODO make dot automatically go to the last point
    displayDotActual = (e) => {
        let timeRange = this.state.timeRange, current = this.props.current
        let upperLimit, dot;
        switch (timeRange) {
            case('Last 7 Days') : upperLimit = 7; break
            case('Last 14 Days') : upperLimit = 14; break
            case('Last 28 Days') : upperLimit = 28; break
            case('Last 2 Months') : upperLimit = 60; break
        }
        dot = 'dot-' + (upperLimit-1)
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
    }

    // shows graph until the object displayed is at the ad level
    showGraph = (data, timeRange) => {
        if (this.props.level !== 'Ad') {
            return( 
                <div style={{width: '100%', margin: '0 auto', height: '83%', zIndex: 2}}>
                    <div className='actionBar'>
                      <div className='dropdowns'>
                        <MainDropdown />
                        <DateDropdown timeRange={timeRange} changeTimeRange={this.changeTimeRange} />
                      </div>
                      <PerformanceBar level={this.props.liveLevel} sub={this.props.liveSub}/>
                    </div>
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
                            <Tooltip labelFormatter={function(value) {return `Day: ${value}`}} labelStyle={{textAlign: 'center', fontWeight: 550}} animationEasing='linear'/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            )
        }
    }

    render() {
        this.showLive()
        const {timeRange} = this.state
        const {liveLevel, liveSub} = this.props
        const data = this.props.currentActive ? this.showLive() : this.getCombinedData() 
        return (
            <div style={{width: '97%', margin: '0 auto', height: '45%', transform: 'translateX(-25px)',  minHeight: 325}}>
                {liveSub && this.showGraph(data, timeRange)}
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
