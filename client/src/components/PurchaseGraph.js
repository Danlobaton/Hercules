import React, { Component } from 'react'
import {Bar, YAxis, XAxis, BarChart, ResponsiveContainer, CartesianGrid, LabelList, Tooltip, Text} from 'recharts'
import PropTypes from 'prop-types'

export class PurchaseGraph extends Component {
    state = {
        height: 0,
        data: this.props.data,
        level: this.props.level
    }
   
    getGraphData = () => {
        var dData = []
        var data = this.state.data.length ? this.state.data.sort((a,b) => a.revenue - b.revenue) : [] // sorts data from least to best performing
        if (this.state.level !== 'Ad') { // TODO check redundancy
            /* returns top 4 best performing ad objects in the sublist if there are more than 4,
                else it just returns the ad objects available */
            if (data.length >= 4) { 
                for (var i = (data.length - 4); i < data.length; i++)
                    dData.push({'Name': data[i].name, 'Purchases': data[i].purchases})
            } else {
                for (i = 0; i < data.length; i++) 
                    dData.push({'Name': data[i].name, 'Purchases': data[i].purchases})
            }
        }
        return dData.reverse()
    }

    // is the label for the vertical titles of the graph
    titleLabel = (e) => {
        return(
            <Text height={e.height} 
            width={300} 
            position={e.position} 
            stroke={e.stroke}  
            x={e.x -8} y={this.state.height -10}
            offset={e.offset}
            angle={-90}
            style={{fontSize: 12, fontWeight: 300}}
            >
                {e.value.length > 25 ? e.value.substring(0, 30) + '...' : e.value /* limits length to 30 and ellipsis */}
            </Text>
        )
    }

    // gets the height of the graph
    componentDidMount() {
        var height = document.getElementById('pGraph').clientHeight
        this.setState({height: height})
    }

    // updates state of the component
    componentWillReceiveProps(nextProps) {
        switch (true) {
            case (nextProps.data !== this.state.data) : this.setState({data: nextProps.data})
            case (nextProps.level !== this.state.level) : this.setState({level: nextProps.level})
            default : break
        }
    }

    showGraph = () => {
        const data = this.getGraphData()
        if (this.props.level !== 'Ad') {
            return (
                <div style={{height: '100%', width: '100%'}}>
                    {!data.length ? (
                        <div style={{position: 'absolute', top: '50%', marginTop: '-10px', left: '50%', width: 400, marginLeft: -180}}>
                            <p style={{fontSize: 12, fontWeight: 350, color: '#A4A4A4', textAlign: 'center', letterSpacing: 3}}>
                                NO DATA AVAILABLE IN THE LAST 60 DAYS
                            </p>
                        </div>
                    ) : null}
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid vertical={false} stroke='#333028'/>
                            {this.state.data.length !== 0 && (<Tooltip labelStyle={{color: '#7F68C2'}} itemStyle={{color: '#181818'}}/>)}
                            <Bar type='monotone' dataKey='Purchases' stroke='#6648B7' strokeWidth={3} barSize={40}>
                                <LabelList dataKey='Purchases' position='top' stroke='white' fill='white' />
                                <LabelList dataKey='Name' position='outside' stroke='#C2C2C2' fill='#C2C2C2' content={this.titleLabel}/>
                            </Bar> 
                            <YAxis tick={{fill: '#A4A4A4', fontSize: 11}} stroke='#45C0E6' tickCount={5} domain={['auto', dataMax=>(dataMax*1.2)]}/>
                            <XAxis dataKey='Name' tick={false} height={0} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )
        }
    }

    render() {
        return (
            <div id='pGraph' style={{height: '76%', width: '100%', transform: 'translateX(-20px)'}}>
                {this.showGraph()}
            </div>
        )
    }
}

PurchaseGraph.propTypes = {
    level: PropTypes.string.isRequired,
    data: PropTypes.array
}

export default PurchaseGraph