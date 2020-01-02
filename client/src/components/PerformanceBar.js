import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class PerformanceBar extends Component {
    // delete when actual performance data is available
    getPerformance = () => {
        var performance = [0, 0, 0]
        if (this.props.level !== "Ad") {
            for (var i = 0; i < this.props.sub.length; i+=1) {
                if (this.props.sub[i].score >= .6) {
                    performance[0] += 1
                } else if (this.props.sub[i].score <= .3) {
                    performance[2] += 1
                } else {
                    performance[1] += 1
                }
            }
        }
        return performance
    }
    
    // show performance bar until object displayed is at the Ad level
    showPeformance = (performance) => {
        if(this.props.level !== 'Ad') {
            return(
                <div style={{display: 'flex'}}>
                    <div  style={pStyle}>
                        <div style={gBadgeStyle}>{performance[0]}</div>
                        <p style={{padding: '0 15px 0 5px'}}>Over-Performing</p>
                    </div>
                    <div  style={pStyle}>
                        <div style={yBadgeStyle}>{performance[1]}</div>
                        <p style={{padding: '0 15px 0 5px'}}>Neutral-Performing</p>
                    </div>
                    <div  style={pStyle}>
                        <div style={rBadgeStyle}>{performance[2]}</div>
                        <p style={{padding: '0 15px 0 5px'}}>Under-Performing</p>
                    </div>
                </div>
            )
        }
    }

    render() {
        const performance = this.getPerformance()
        return (
            <div>
                {this.showPeformance(performance)}
            </div>
        )
    }
}



const gBadgeStyle = {
    padding: '2px 6px',
    height: '70%',
    background: '#3CC480',
    fontSize: 11,
    color: 'white',
    fontWeight: 650,
    transform: 'translateY(-3px)'
}

const rBadgeStyle = {
    padding: '2px 6px',
    height: '70%',
    background: '#FF7474',
    fontSize: 11,
    color: 'white',
    fontWeight: 650,
    transform: 'translateY(-3px)'
}

const yBadgeStyle = {
    padding: '2px 6px',
    height: '70%',
    background: '#FAFA5B',
    fontSize: 11,
    color: 'black',
    fontWeight: 650,
    transform: 'translateY(-3px)'
}

const pStyle = {
    display: 'flex', 
    fontSize: 11,
    fontWeight: 650,
    color: '#8B8B8B',
    alignContent: 'baseline'
}

PerformanceBar.propTypes = {
    level: PropTypes.string.isRequired,
    sub: PropTypes.array
}

export default PerformanceBar
