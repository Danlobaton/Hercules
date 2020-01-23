import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

export class MainDropdown extends Component {
    container = React.createRef(); // reference to the container of the DOM element
    state = {
        filterOption: 'Purchases',
        open: false
    }

    // sets up event listener to check when outside clicks occur to close dropdown
    componentDidMount() { document.addEventListener("mousedown", this.handleClickOutside) }
    componentWillUnmount() { document.removeEventListener("mousedown", this.handleClickOutside) }

    // closes menu when user clicks outside of the dropdown
    handleClickOutside = (event) => {
        if (this.container.current && !this.container.current.contains(event.target)) {
          this.setState({open: false})
        }
    }
    
    // opens and closes menu on toggle click
    handleButtonClick = () => {
        this.setState({open: !this.state.open})
    }
    
    render() {
        return (
            <div style={{display: 'flex'}}>
                <div style={container} ref={this.container}>
                    <button type="button" style={filterStyle} onClick={this.handleButtonClick}>
                        {this.state.filterOption}<div style={{fontSize: 6, fontWeight: 750}}>▼</div>
                    </button>
                    {this.state.open && (
                    <div style={dropdown}>
                    <ul style={ul} onClick={this.handleButtonClick}>
                        <li id='dropMenu'>Option 1</li>
                    </ul>
                    </div>)}
                </div>
            </div>
        )
    }
}
const container = {
    position: 'relative',
    display: 'inline-block'
}

const filterStyle = {
    width: 250,
    border: '1px solid #7F68C2',
    textAlign: 'left',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    fontWeight: 500,
    color: '#7F68C2',
    padding: 5,
    background: 'none',
    borderRadius: 0,
    fontSize: '11px',
    outline: 'none'
}

const dropdown = {
    position: 'absolute', 
    top: '65%', 
    left: 0, 
    width: '100%', 
    zIndex: 2, 
    border: '1px solid rgba(0, 0, 0, 0.15)', 
    transform: 'translateY(-5px)'
}

const ul = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
}

const il = {
    background: '#FFFFFF',
    padding: 5
}

const ilHovered = {
    color: 'white',
    background: '#6648B7'
}

export default MainDropdown
