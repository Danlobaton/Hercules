import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class PerformanceBar extends Component {
    // delete when actual performance data is available
    getPerformance = () => {
        var performance = [0, 0, 0]
        var sub = this.props.sub
        if (this.props.level !== "Ad") {
            for (var i = 0; i < sub.length; i+=1) {
                switch (true) {
                    case (sub[i].score >= .6) : performance[0] += 1; break
                    case (sub[i].score === false) : performance[1] += 1; break
                    case (sub[i].score <= .3) : performance[2] += 1; break
                    default : performance[1] += 1; break
                }
            }
        }
        return performance
    }
    
    // show performance bar until object displayed is at the Ad level
    showPeformance = (performance) => {
        const level = this.props.level
        if(level !== 'Ad') {
            return(
                <div style={{display: 'flex'}}>
                    <div  style={pStyle}>
                        <div style={gBadgeStyle}>{performance[0]}</div>
                        Over-Performing
                    </div>
                    <div  style={pStyle}>
                        <div style={yBadgeStyle}>{performance[1]}</div>
                        Neutral-Performing
                    </div>
                    <div  style={pStyle}>
                        <div style={rBadgeStyle}>{performance[2]}</div>
                        Under-Performing
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
    background: '#3CC480',
    fontSize: 11,
    color: 'white',
    fontWeight: 650,
    transform: 'translate(-5px, -3px)'
}

const rBadgeStyle = {
    padding: '2px 6px',
    background: '#FF7474',
    fontSize: 11,
    color: 'white',
    fontWeight: 650,
    transform: 'translate(-5px, -3px)'
}

const yBadgeStyle = {
    padding: '2px 6px',
    background: '#FAFA5B',
    fontSize: 11,
    color: 'black',
    fontWeight: 650,
    transform: 'translate(-5px, -3px)'
}

const pStyle = {
    display: 'flex', 
    fontSize: 11,
    fontWeight: 650,
    color: '#8B8B8B',
    alignContent: 'baseline',
    padding: 15
}

PerformanceBar.propTypes = {
    level: PropTypes.string.isRequired,
    sub: PropTypes.array
}

export default PerformanceBar
