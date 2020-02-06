import React, { Component } from 'react'
import backgroundImg from './backgroundIMG.png'
import loadingGraph from './loadingGraph.png'
import admLoading from './admLoading.png'

export class InitLoading extends Component {
    render() {
        let {loadCount, loaded} = this.props
        let loadIndex = !loaded ? 300 : 0;
        let loadgraph = !loaded ? 0 : 274;
        let opacity = !loaded ? 1 : 0;

        return (
            <div style={{...loadState, zIndex: loadIndex, opacity: opacity}}>
                <img src={backgroundImg} alt='triangles dude' style={{height: '100%', width: '100%', position: 'absolute'}} />
                <div style={{display: 'flex', margin: '0 auto', flexDirection: 'column', transform: 'translateY(-60px)'}}>
                    <div style={{...loadingGraphS, width: loadgraph}}/>
                    <img src={admLoading} alt='adm loading' style={{transform: 'translateY(50px)'}} />
                </div>
            </div>
        )
    }
}

const loadState = { 
    height: '100%',
    width: '100%',
    position: "absolute",
    transition: 'z-index 1500ms',
    display: 'flex',
    justifyContent: 'space-around',
    alignItem: 'middle',
    flexDirection: 'column',
    margin: '0 auto',
    background: 'black',
    transition: 'opacity 1000ms, z-index 1000ms',
    transitionDelay: '1000ms',
}

const loadingGraphS = {
    backgroundImage: `url(${loadingGraph})`,
    height: 150,
    overflow: 'hidden',
    transition: 'width 500ms'
}

export default InitLoading
