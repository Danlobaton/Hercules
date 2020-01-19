import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class ObjectListItem extends Component {
    // Gets style based on color
    getStyle = () => {
        var setting;
        var score = this.props.object.score
        switch (true) {
            case (score >= .6) : setting = '10px solid #3CC480'; break
            case (score === false) : setting = '10px solid #FAFA5B'; break
            case (score <= .3) : setting = '10px solid #FF7474'; break
            default : setting = '10px solid #FAFA5B'; break
        }
        return {
            display: 'flex',
            padding: '15px',
            borderLeft: setting,
            flexDirection: 'row',
            borderBottom: '1px solid #353535'
        }
    }

    render() {
        const {changeData, nextLevel, object} = this.props
        return (
            <div style={this.getStyle(object.score)}>
                <button onClick={changeData.bind(this, object.id, nextLevel, object.name, object)} style={buttonStyle}>
                    <p style={titleStyle}>{object.name.length > 60 ? object.name.substring(0, 60) + '...' : object.name}</p>
                    <div style={infoContainerStyle}>                        
                        <p style={pStyle}>Purchases: {object.purchases}</p>         
                        <p style={pStyle}>ROAS: {object.roas}</p>   
                    </div>
                </button>    
            </div>
        )
    }
}

const buttonStyle = {
    border: '0', 
    padding: '0', 
    background: 'none', 
    width: '100%', 
    transform: 'translateY(5px)'
}
const titleStyle = {
    fontWeight: '600', 
    color: 'white', 
    textAlign: 'left',
    fontSize: 15
}
const infoContainerStyle = {
    display: 'flex', 
    width: '70%', 
    justifyContent: 'space-between', 
    flexWrap: 'wrap'
}
const pStyle = {
    fontSize: '11px',  
    color: 'white', 
    textAlign: 'left', 
    transform: 'translateY(-5px)', 
    lineHeight: '0px'
}

ObjectListItem.propTypes = {
    object: PropTypes.object.isRequired,
    changeData: PropTypes.func.isRequired
}

export default ObjectListItem