import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class InfoCol extends Component {
    // Rounds an integer and returns formatted number 
    roundInt = (value) => {
        var num = (typeof value === 'string') ? parseInt(value) : parseInt(value)
        var strInt = num.toString()

        // rounds number
        switch (true) {
            case (strInt.length >= 7) : return ((num / 1000000).toString().substring(0, 4) + 'M')
            case (strInt.length >= 4) : return ((num / 1000).toString().substring(0, 4) + "K")
            default : return strInt.toString()
        }
    } 

    // Rounds a double
    roundDouble = (num) => {
        var strDub = num ? num.toString() : '0'
        return strDub.substring(0, strDub.indexOf('.') + 3)
    }

    render() { 
        const liveKPI = this.props.liveKPI
        return (
            <div style={infoColStyle}>
                <div style={moduleStyle}>
                    <div style={textBox}>
                        <p style={titleStyle}>AMOUNT SPENT</p>
                        <p style={valueStyle}>${this.roundInt(liveKPI.spent)}</p>
                    </div>
                </div>
                <div style={moduleStyle}>
                    <div style={textBox}>                    
                        <p style={titleStyle}>PURCHASES</p>
                        <p style={valueStyle}>{this.roundInt(liveKPI.purchases)}</p>
                    </div>
                </div>
                <div style={moduleStyle}>
                    <div style={textBox}>                        
                        <p style={titleStyle}>COST PER SALE</p>
                        <p style={valueStyle}>${this.roundDouble(liveKPI.costPerPurchase)}</p>
                    </div>
                </div>
                <div style={moduleStyle}>
                    <div style={textBox}>                        
                        <p style={titleStyle}>REVENUE</p>
                        <p style={valueStyle}>${this.roundInt(liveKPI.revenue)}</p>
                    </div>
                </div>
                <div style={moduleStyle}>
                    <div style={textBox}>
                        <p style={titleStyle}>IMPRESSIONS</p>
                        <p style={valueStyle}>{this.roundInt(liveKPI.impressions)}</p>
                    </div>
                </div>
                <div style={moduleStyle}>
                    <div style={textBox}>
                        <p style={titleStyle}>REACH</p>
                        <p style={valueStyle}>{this.roundInt(liveKPI.reach)}</p>
                    </div>
                </div>
                <div style={moduleStyle}>
                    <div style={textBox}>
                        <p style={titleStyle}>CLICKS</p>
                        <p style={valueStyle}>{this.roundInt(liveKPI.clicks)}</p>
                    </div>
                </div>
            </div>
        )
    }
}

const infoColStyle = {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-end',
    height: '70%',
    transform: 'translateY(80px)'
}

const moduleStyle = {
    height: 80,
    width: '90%',
    background: '#FAF9F7',
    lineHeight: .5,
    borderRadius: '5px 0 0 5px',
    marginTop: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent:'space-around'
}

const textBox = {
    color: '#6648B7',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    padding: '0 25px 0 0',
    transform: 'translateY(5px)'
}

const titleStyle = {
    fontSize: 11,
    letterSpacing: 1,
    fontWeight: 350
}

const valueStyle = {
    fontSize: 25,
    fontWeight: 650
}

InfoCol.propTypes = {
    liveKPI: PropTypes.object.isRequired
}

export default InfoCol
