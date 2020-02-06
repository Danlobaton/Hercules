import React, { Component } from 'react'
import PropTypes from 'prop-types'

export class ListTaskBar extends Component {
    state = {
        selection: '' // keeps track of radio selection
    }

    // prevents default form refresh on submit
    onSubmit = (e) => e.preventDefault()

    // changes the marked bubble in state
    onMark = (e) => this.setState({selection: e.target.value})
    
    render() {
        const {filterLogo, sort, filter, sortLogo} = this.props
        const selection = this.state.selection
        return (
            <div>
                <form style={taskBarStyle} onSubmit={this.onSubmit}>
                    <button style={filterStyle} onClick={filter.bind(this, selection)}>
                        <p style={{lineHeight: '0px', fontSize: '11px', transform: 'translateY(9px)'}}>FILTER</p>
                        <img alt='f' src={filterLogo} height='15px'/>
                    </button>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input type='radio' id='perfChoice1' name='performance' value='green' onChange={this.onMark}/>
                        <label for='perfChoice1' style={labelStyle}>
                            <div style={{background: '#3CC480', height: '100%', width: '100%', transform: 'translateX(3px)'}}/>
                        </label>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input type='radio' id='perfChoice2' name='performance' value='yellow' onChange={this.onMark}/>
                        <label for='perfChoice2' style={labelStyle}>
                            <div style={{background: '#FAFA5B', height: '100%', width: '100%', transform: 'translateX(3px)'}}/>
                        </label>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <input type='radio' id='perfChoice3' name='performance' value='red' onChange={this.onMark}/> 
                        <label for='perfChoice3'style={labelStyle}>
                            <div style={{background: '#FF7474', height: '100%', width: '100%', transform: 'translateX(3px)'}}/>
                        </label>
                    </div>
                    <button style={filterStyle} type='submit' onClick={sort.bind(this, selection)}> 
                        <p style={{lineHeight: '0px', fontSize: '11px', transform: 'translateY(9px)'}}>SORT</p>
                        <img alt='s' src={sortLogo} height='13px'style={{transform: 'translateY(1.5px)'}}/>
                    </button>
                </form>
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

const labelStyle = {
    width: 7, 
    height: 20, 
    transform: 'translateY(4px)'
}

ListTaskBar.propTypes = {
    filterLogo: PropTypes.string.isRequired,
    sortLogo: PropTypes.string.isRequired
}

export default ListTaskBar
