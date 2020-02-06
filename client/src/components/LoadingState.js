import React, { Component } from 'react'
import InitLoading from './pages/initLoading'

export class LoadingState extends Component {
    render() {
        let loadCount = this.props.loadCount 
        const {isLoaded} = this.props
        let loadTop = !isLoaded ? '10px' : '-5%'
        let loadHeight = !isLoaded ? '80%' : 0
        let loadIndex = !isLoaded ? 100 : 0
        let loadStart = !isLoaded ? 60 : 0
        let loadOpacity = !isLoaded ? 1 : 0
        
        if (loadCount <= 1) {
            return (<InitLoading loaded={isLoaded}/>) 
        } else {
            return (
                <div style={{...loadState, zIndex: loadIndex,opacity: loadOpacity}}>
                    <div className='innerLoad' style={loadingCircleSmall} />
                    <div className= 'outerLoad' style={loadingCircleLarge} />
                    <p style={{transform: 'translateY(85px)', margin: '0 auto'}}>LOADING</p>
                </div>
            )
        }
    }
}

const loadState = {
    height: '100%', 
    width: '100%', 
    position: "absolute", 
    transition: 'z-index 1500ms, opacity 1200ms',
    background: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'middle',
    color: '#dedede',
    letterSpacing: 3,
    fontSize: 12,
    fontWeight: 300
}

const gradientCircle = {
    height: 100,
    width: 100,
    borderRadius: '50%',
    borderWidth: '30%',
    borderStyle: 'solid',
    borderImage: 'linear-gradient(to right, rgba(116, 71, 184, 0.97), rgba(116, 71, 184, 0))',
    left: '50%',
    marginLeft: '-50px',
    position: 'absolute'
}

const loadingCircleSmall = {
    height: 100,
    width: 100,
    borderRadius: '50%',
    border: '1px solid #801bf3',
    left: '50%',
    marginLeft: '-50px',
    position: 'absolute',
    backgroundImage: 'radial-gradient(rgba(108, 10, 194, 0), rgba(108, 10, 194, 0.80), rgba(108, 10, 194, 1))',
    zIndex: 2
}
 
const loadingCircleLarge = {
    height: 130,
    width: 130,
    borderRadius: '50%',
    border: '2px solid #A989FF',
    left: '50%',
    marginLeft: '-65px',
    position: 'absolute',
    backgroundImage: 'radial-gradient(rgba(108, 10, 194, 0), rgba(108, 10, 194, 1))',
    zIndex: 1,
    boxShadow: '0 0 20px rgba(169, 137, 255, .7)'
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
