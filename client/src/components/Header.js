import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../logo.png'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import PropTypes from 'prop-types'

export class Header extends Component {
    // Gets the ad accounts and makes them dropdown elements for accessibilty in the header 
    getAdAccounts = (adAccount) => {
        return (
            <NavDropdown.Item onClick={this.props.changeAdAccount.bind(this, adAccount)} key={adAccount.id}>
                {adAccount.name}
            </NavDropdown.Item>
        )
    }

    render() {
        return (
            <div>
                <Navbar bg='black' variant='dark' style={{background: 'black', zIndex: 1}}>
                    <Navbar.Brand as='button' style={{background: 'none', border: '0'}} onClick={this.props.goHome}>
                        <img src={logo} alt='ADM' height='30px'/>
                    </Navbar.Brand>
                    <Nav style={{color: 'white', transform: 'translateX(60px)'}}>
                        <NavDropdown title="Choose Ad Account" id="basic-nav-dropdown">
                            {this.props.master.map((adAccount) => this.getAdAccounts(adAccount))}
                        </NavDropdown>
                    </Nav>
                </Navbar>
            </div>
        )
    }
}

Header.propTypes = {
    master: PropTypes.array.isRequired,
    goHome: PropTypes.func.isRequired
}

export default Header
