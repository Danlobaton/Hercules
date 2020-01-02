import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class ObjectListItem extends Component {
    // Gets style based on color
    getStyle = () => {
        var setting
        if (this.props.object.score >= .6) {
            setting = '10px solid #3CC480'
        } else if (this.props.object.score <= .3) {
            setting = '10px solid #FF7474'
        } else {
            setting = '10px solid #FAFA5B'
        }
        return {
            display: 'flex',
            padding: '15px',
            borderLeft: setting,
            flexDirection: 'row',
            borderBottom: '1px solid black'
        }
    }

    render() {
        const object = this.props.object
        return (
            <div style={this.getStyle(object.score)}>
                <button onClick={this.props.changeData.bind(this, object.id, this.props.nextLevel)} style={buttonStyle}>
                    <p style={titleStyle}>{object.name}</p>
                    <div style={infoContainerStyle}>                        
                        <p style={pStyle}>Purchases: {object.purchases}</p>            
                        <p style={pStyle}>ROAS: {object.ROAS}</p>
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
    textAlign: 'left'
}
const infoContainerStyle = {
    display: 'flex', 
    width: '70%', 
    justifyContent: 'space-between', 
    flexWrap: 'wrap'
}
const pStyle = {
    fontSize: '12px',  
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