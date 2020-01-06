import React, { Component } from 'react'
import {Bar, YAxis, XAxis, BarChart, ResponsiveContainer, CartesianGrid, LabelList, Tooltip, Text} from 'recharts'
import PropTypes from 'prop-types'

export class ProfitGraph extends Component {
    state = {
        height: 0, // height of graph
        data: this.props.data,
        level: this.props.level
    }

    getGraphData = () => {
        var dData = []
        var data = this.state.data ? this.state.data.sort((a,b) => a.score - b.score) : [] // sorts data from least to best performing
        if (this.state.level !== 'Ad') { // TODO check redundancy
            /* returns top 4 best performing ad objects in the sublist if there are more than 4,
                else it just returns the ad objects available */
            if (data.length >= 4) {
                for (var i = (data.length - 4); i < data.length; i++) 
                    dData.push({'Name': data[i].name, 'Amount Spent': data[i].spend, 'Revenue': data[i].revenue})
            } else {
                for (i = 0; i < data.length; i++) 
                    dData.push({'Name': data[i].name, 'Amount Spent': data[i].spend, 'Revenue': data[i].revenue})
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
            style={{fontSize: 10, fontWeight: 300}}
            >
                {e.value}
            </Text>
        )
    }

    // gets the revenue and amount spent label
    generalLabel = (e) => {
        // if the label is at the upper 75% of the graph, then it will display a vertical label
        // else the label will be displayed on the top of the bar graph
        if(e.y < this.state.height * .75) {
            return(
                <Text height={e.height} 
                width={110} 
                position={e.position} 
                stroke={e.stroke}  
                x={e.x + 23} y={e.y+ 5}
                offset={e.offset}
                angle={-90}
                textAnchor='end'
                fill='white'
                style={{fontWeight: 300}}
                >
                    {'$' + e.value}
                </Text>
            )
        } else {
            return(
                <Text height={e.height} 
                width={110} 
                position={e.position} 
                stroke={e.stroke}  
                x={e.x} y={e.y - 6}
                offset={e.offset}
                fill='white'
                style={{fontWeight: 300}}
                >
                    {'$' + e.value}
                </Text>
            )
        }
    }

    // gets the height of graph
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

    render() {
        const data = this.getGraphData() // live data
        return (
            <div style={{height: '80%', width: '100%', transform: 'translateX(-20px)'}}>
                <ResponsiveContainer>
                    <BarChart data={data}>
                        <CartesianGrid vertical={false} stroke='#333028'/>
                        <Tooltip labelStyle={{color: '#7F68C2'}} />
                        <Bar type='monotone' dataKey='Amount Spent' stroke='#6648B7' strokeWidth={3} barSize={35}>
                            <LabelList dataKey='Name' position='outside' stroke='#C2C2C2' content={this.titleLabel}/>
                            <LabelList dataKey='Amount Spent' position='' stroke='white' content={this.generalLabel}/>
                        </Bar>
                        <Bar type='monotone' dataKey='Revenue' stroke='#55C2E8' strokeWidth={3} barSize={35}>
                            <LabelList dataKey='Revenue' position='' stroke='white' content={this.generalLabel}/>
                        </Bar>
                        <YAxis tick={{fill: '#A4A4A4', fontSize: 11}} stroke='#45C0E6' tickCount={5} domain={['auto', dataMax=>(dataMax*1.2)]} />
                        <XAxis dataKey='Name' tick={false} height={0} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

ProfitGraph.propTypes = {
    data: PropTypes.array,
    level: PropTypes.string.isRequired
}

export default ProfitGraph
