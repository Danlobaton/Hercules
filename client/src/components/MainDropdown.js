import React, { Component } from 'react'
import Dropdown from 'react-bootstrap/Dropdown'

export class MainDropdown extends Component {
    // This will be of use at some point
    state = {
        filterOption: 'Purchases'
    }
    
    render() {
        return (
            <div>
                <Dropdown >
                    <Dropdown.Toggle style={filterStyle} id="dropdown-basic">
                        {this.state.filterOption}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                      <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    }
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
}

export default MainDropdown
