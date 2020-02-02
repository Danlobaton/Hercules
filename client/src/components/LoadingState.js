import React, { Component } from 'react'

export class LoadingState extends Component {
    render() {
        const {isLoaded} = this.props
        let loadTop = !isLoaded ? '10px' : '-5%'
        let loadHeight = !isLoaded ? '80%' : 0
        let loadIndex = !isLoaded ? 100 : 0
        let loadStart = !isLoaded ? 60 : 0
        return (
            <div style={{height: '100%', width: '100%', position: "absolute", zIndex: loadIndex, transition: 'z-index 1500ms'}}>
                <div style={{height: 60}}>
                    <div style={{...loadingPrompt, top: loadTop}}>
                        Loading <div className='loadBubble' style={{transform: 'translateY(2px)'}} />
                    </div>
                </div>
                <div style={{width: '100%', height: loadHeight, transition: 'height 1500ms'}}>
                    <div style={{...screenCover}} />
                </div>
            </div>
        )
    }
}
    
const loadingPrompt = {
    position: 'absolute',
    padding: '10px 25px',
    background: '#FAF9F7',
    color: '#707070',
    fontWeight: 600,
    fontSize: 12,
    width: 130,
    left: '50%',
    marginLeft: '-65px',
    textAlign: 'center',
    transition: 'top 350ms',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
}

const screenCover = {
    background: 'linear-gradient(rgba(101, 71, 184, 0.72), rgba(101, 71, 184, 0.00)',
    width: '100%',
    height: '80%',
    transition: 'height 1500ms',
}

export default LoadingState
