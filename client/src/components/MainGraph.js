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

    // current upper limit for main graph
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

    formatDate = (date) => {
        let month = ''
        let day = ''

        // adds 0 to single digit days  
        switch (date.substring(6, 7)) {
            case('0') : day = date.substring(7); break
            default : day = date.substring(6); break
        }

        // add month abbreviation 
        switch(date.substring(3,5)) {
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

    fillDateRange = (coordinates, limit) => {
        let date = new Date().toJSON().slice(0,10).substring(2)
        let year = parseInt(date.substring(0,2))
        let month = parseInt(date.substring(3,5))
        let day = parseInt(date.substring(6))
        let adjustedDates = [], coordIndex = coordinates.length

        for (let i = limit; i > 0; i--) {
            day--
            if (day === 0) {
                month--
                // resets month when year is subtracted
                if (month === 0) {
                    month = 12; 
                    year--;
                }

                // handles different amount of days in month
                switch (true) {
                    case (month <= 6 && month % 2 === 0 && month !== 2) : day = 30; break
                    case (month <= 6 && month !== 2) : day = 31; break
                    case (month > 6 && month % 2 === 0) : day = 31; break
                    case (month > 6) : day = 30; break
                    case (month === 2 && year % 4 === 0) : day = 29; break 
                    default : day = 28; break
                }
            }

            // sets date to current (in scope of for-loop)
            date = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
            
            // handles gaps in time range
            if(coordIndex > 0 && date === coordinates[coordIndex-1].day) {
                adjustedDates.push(coordinates[coordIndex-1])
                coordIndex--
            } else {
                adjustedDates.push({
                    'day': date,
                    'y': 0
                })
            }
        }
        return adjustedDates.reverse()
    }

    showLive = () => {
        const current = this.props.current
        const timeRange = this.state.timeRange
        let upperLimit, graphData = [];
        
        // sets limit according to drop-down option
        switch (timeRange) {
            case ('Last 7 Days') : upperLimit = 7; break
            case ('Last 14 Days') : upperLimit = 14; break
            case ('Last 28 Days') : upperLimit = 28; break
            case ('Last 2 Months') : upperLimit = 60; break
        }   

        if (current[0]) {
            // fills gap in current data and iterates over it
            let adjusted = this.fillDateRange(current, upperLimit) 
            adjusted.forEach(coordinate => {
                graphData.push({
                    'Day': this.formatDate(coordinate.day),
                    'Predicted': null,
                    'Current': coordinate.y
                })
            })
        }
        return graphData
    }

    // Custom dot for Current line
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
