import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class ListTaskBar extends Component {
    // TODO make this component a form that make both buttons of type 'submit'
    render() {
        return (
            <div style={taskBarStyle}>
                <button style={filterStyle}>
                    <p style={{lineHeight: '0px', fontSize: '11px', transform: 'translateY(7px)'}}>FILTER</p>
                    <img alt='f' src={this.props.filterLogo} height='15px'/>
                </button>
                <div style={{display: 'flex', alignItems: 'center'}}><input type='radio' /> <div style={{background: '#3CC480', width: 7, height: 20}}/></div>
                <div style={{display: 'flex', alignItems: 'center'}}><input type='radio' /> <div style={{background: '#FAFA5B', width: 7, height: 20}}/></div>
                <div style={{display: 'flex', alignItems: 'center'}}><input type='radio' /> <div style={{background: '#FF7474', width: 7, height: 20}}/></div>
                <button style={filterStyle} onClick={this.props.sort}>
                    <p style={{lineHeight: '0px', fontSize: '11px', transform: 'translateY(7px)'}}>SORT</p>
                    <img alt='s' src={this.props.sortLogo} height='13px'style={{transform: 'translateY(1.5px)'}}/>
                </button>
            </div>
        )
    }
}

const taskBarStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '4.25em',
    flexWrap: 'wrap',
}

const filterStyle = {
    width: 75,
    border: '1px solid white',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    fontWeight: 650,
    color: 'white',
    padding: 5,
    background: 'none'
}

ListTaskBar.propTypes = {
    filterLogo: PropTypes.string.isRequired,
    sortLogo: PropTypes.string.isRequired
}

export default ListTaskBar
