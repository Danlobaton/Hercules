import React, { Component } from 'react'
import logo from '../logo.png'
import back from '../back.png'
import PropTypes from 'prop-types'

export class AppHeader extends Component {
    headerMenu = React.createRef() // creates reference to header menu container in DOM element
    state = {
        open: false,
        first: true
    }

    // listens for click events outside of header menu
    componentDidMount() { document.addEventListener('mousedown', this.handleClickOutside) }
    componentWillUnmount() {document.removeEventListener('mousedown', this.handleClickOutside) }

    // closes dropdown menu when user clicks anywhere outside of the headerMenu container
    handleClickOutside = (event) => {
        if (this.headerMenu.current && !this.headerMenu.current.contains(event.target)) 
            this.setState({open: false})
    }

    // opens and closes dropdown menu when clicking on the button
    handleButtonClick = () => this.setState({open: !this.state.open})


    handleListClick = () => {
        this.setState({open: false})
    }

    // gets ad accounts for dropdown menu
    getAdAccounts = (adAccount) => {
        const {master, changeAdAccount} = this.props
        if (master.length > 0) {
            return (
                <button id='hDropMenu' onClick={changeAdAccount.bind(this, adAccount.id, adAccount.level, adAccount.name)}>
                    {adAccount.name}
                </button>
            )
        } else {
            return (
                <button id='hDropMenu'/>
            )
        }
    }

    // listens to first prop change so placeholder text can change with ad account name as soon as everything loads
    listener = () => {
        const {master, history} = this.props
        if (master[0]) {
            if (history[0].name !== master[0].name) 
                this.setState({first: false})
        }
    }

    render() {
        const {goHome, goBack, history} = this.props
        const master = this.props.master ? this.props.master : []
        this.state.first && this.listener()
        let width = history.length > 0 && history[history.length-1].level !== 'Ad Account' ? 75 : 0
        let bWidth = history.length > 0 && history[history.length-1].level !== 'Ad Account' ? 15 : 0
        let border = history.length > 0 && history[history.length-1].level !== 'Ad Account' ? '1px solid #707070' : 'none'
        let cursor = history.length > 0 && history[history.length-1].level !== 'Ad Account' ? 'pointer' : 'default'
        return (
            <div style={headerStyle}>
                <div style={innerHeaderStyle} >
                    <button 
                        style={{...backButton, width: width, borderRight: border, cursor: cursor}}
                        onClick={history.length > 0 && history[history.length-1].level !== 'Ad Account' ? goBack : null}    
                    >
                        <img src={back} height='30' style={{transition: 'width 350ms', width: bWidth, transform: 'rotate(180deg) translateX(-3px)'}} />
                    </button>
                    <button style={homeButton} onClick={goHome}>
                        <img src={logo} height='30' alt='ADM'/>
                    </button>
                    <div style={headerDropdown} ref={this.headerMenu}>
                        <button style={headerDropdownButton} onClick={this.handleButtonClick}>
                            {this.state.first ? 'Choose Ad Account' : history[0].name}
                            <div style={{fontSize: 8, fontWeight: 750, paddingLeft: 5, transform: 'translateY(-2px)'}}>▼</div>
                        </button>
                        {this.state.open && (
                            <div style={dropdown}>
                                <ul style={ulStyle} onClick={this.handleButtonClick}>
                                    {master.map((adAccount) => this.getAdAccounts(adAccount))}
                                </ul>
                            </div>
                        )}                       
                    </div>
                </div>
            </div>
        )
    }
}
const headerStyle = {
    width: '100%',
    height: 60,
    minHeight: 60,
    background: 'black',
    display: 'flex',
} 
const innerHeaderStyle = {
    display: 'flex',
    width: 600,
    alignItems: 'baseline',
}
const homeButton = {
    background: 'none',
    border: 'none',
}
const backButton = {
    background: 'none', 
    outline:'none', 
    border: 'none', 
    height: 60,  
    transform: 'translateX(-10px)',
    transition: 'width 350ms'
}
const headerDropdown = {
    position: 'relaitve',
    display: 'inline-block',
    transform: 'translateX(40px)',
    zIndex: 2
}
const headerDropdownButton = {
    fontSize: 15,
    fontWeight: 600,
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    background: 'none',
    border: 'none',
    alignItems: 'baseline',
    outline: 'none',
}
const ulStyle = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
}
const dropdown = {
    position: 'absolute',  
    width: 250,
    zIndex: 2, 
    border: '1px solid rgba(0, 0, 0, 0.15)', 
    transform: 'translateY(5px)',
    overflow: 'auto',
    height: 300
}

export default AppHeader
