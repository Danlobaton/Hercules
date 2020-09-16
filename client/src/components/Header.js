import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar'
import logo from '../assets/logo.png'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import PropTypes from 'prop-types'

export class Header extends Component {
    // Gets the ad accounts and makes them dropdown elements for accessibilty in the header 
    getAdAccounts = (adAccount) => {
        const {master, changeAdAccount} = this.props
        if (master.length > 0) { 
            return (
                <NavDropdown.Item onClick={changeAdAccount.bind(this, adAccount.id, adAccount.level, adAccount.name)} key={adAccount.id}>
                    {adAccount.name}
                </NavDropdown.Item>
            )
        } else {
            return (<NavDropdown.Item key='0'></NavDropdown.Item>)
        }
    }

    render() {
        const master = this.props.master ? this.props.master : [] 
        const goHome = this.props.goHome
        return (
            <div>
                <Navbar bg='black' variant='dark' style={{background: 'black', zIndex: 1}}>
                    <Navbar.Brand as='button' style={{background: 'none', border: '0'}} onClick={goHome}>
                        <img src={logo} alt='ADM' height='30px'/>
                    </Navbar.Brand>
                    <Nav style={{color: 'white', transform: 'translateX(60px)'}}>
                        <NavDropdown title="Choose Ad Account" id="basic-nav-dropdown">
                            {master.map((adAccount) => this.getAdAccounts(adAccount))}
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
