import React, { Component } from 'react'
import {Bar, YAxis, XAxis, BarChart, ResponsiveContainer, CartesianGrid, LabelList, Tooltip, Text} from 'recharts'
import PropTypes from 'prop-types'

export class ProfitGraph extends Component {
    state = {
        height: 0, // height of graph
        data: this.props.data,
        level: this.props.level
    }

    letterRound = (num) => {
        let numStr = num.toString()
        numStr = numStr.indexOf('.') === -1 ? numStr : numStr.substring(0, numStr.indexOf('.'))
        switch (true) {
            case(numStr.length >= 7) : return Math.round((num / 1000000), 1).toString() + 'M'
            case(numStr.length >= 4) : return Math.round((num / 1000), 1).toString() + 'K'
            default : return numStr
        }
    }

    getGraphData = () => {
        var dData = []
        var data = this.state.data.length ? this.state.data.sort((a,b) => a.revenue - b.revenue) : [] // sorts data from least to best performing
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
            fill={e.fill}
            x={e.x -8} y={this.state.height -10}
            offset={e.offset}
            angle={-90}
            style={{fontSize: 12, fontWeight: 300}}
            >
                {e.value.length > 25 ? e.value.substring(0, 30) + '...' : e.value /* Limits name length to 30 and ellipsis */}
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
                fill={e.fill}
                x={e.x + 23} y={e.y + 5}
                offset={e.offset}
                angle={-90}
                textAnchor='end'
                style={{fontWeight: 300}}
                >
                    {'$' + this.letterRound(e.value)}
                </Text>
            )
        } else {
            return(
                <Text height={e.height} 
                width={110} 
                position={e.position} 
                stroke={e.stroke}  
                fill={e.fill}
                x={e.x} y={e.y - 6}
                offset={e.offset}
                style={{fontWeight: 300}}
                >
                    {'$' + this.letterRound(e.value)}
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
            <div style={{height: '76%', width: '100%', transform: 'translateX(-20px)'}}>
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
                        {this.state.data.length !== 0 && (<Tooltip labelStyle={{color: '#7F68C2'}} itemStyle={{color: '#181818'}} />)}
                        <Bar type='monotone' dataKey='Amount Spent' stroke='#6648B7' strokeWidth={3} barSize={35}>
                            <LabelList dataKey='Name' position='outside' stroke='#C2C2C2' fill='#C2C2C2' content={this.titleLabel}/>
                            <LabelList dataKey='Amount Spent' position='' stroke='white' fill='white' content={this.generalLabel}/>
                        </Bar>
                        <Bar type='monotone' dataKey='Revenue' stroke='#55C2E8' strokeWidth={3} barSize={35}>
                            <LabelList dataKey='Revenue' position='' stroke='white' fill='white' content={this.generalLabel}/>
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
