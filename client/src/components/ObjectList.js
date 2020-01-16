import React, { Component } from 'react'
import ObjectListItem from './ObjectListItem'
import filter from '../filter.png'
import sort from '../sort.png'
import TaskBar from './ListTaskBar'
import PropTypes from 'prop-types'

export class ObjectList extends Component {
    state = {
        objectRecord: this.props.objectRecord // this will keep track of what state the objects are in (sorted or filtered)
    }

    // sorts ad objects by performance
    sort = (selection) => {
        this.setState({objectRecord: null}) // resets object record
        var objects = this.props.objects

        if (selection === 'green') {
            this.setState({objectRecord: objects.sort((a, b) => b.score - a.score)})
        } else if (selection === 'red') {
            this.setState({objectRecord: objects.sort((a, b) => a.score - b.score)})
        } else if(selection === 'yellow') {
            var count = 0, target = objects[count]
            for (var i = 0; i < objects.length; i++) {
                if (objects[i].score > .3 && objects[i].score < .6) {
                    objects[count] = objects[i]
                    objects[i] = target
                    count++
                    target = objects[count]
                }
            }
            this.setState({objectRecord: objects})
        } 
    }

    // filters ad objects by performance
    filter = (selection) => {
        this.setState({objectRecord: null}) // resets object record
        var output = [], objects = this.props.objects, i

        // might refactor to make more efficient
        for (i = 0; i < objects.length; i++) {
            if (selection === 'green') {
                if (objects[i].score >= .6) {
                    output.push(objects[i])
                }
            } else if (selection === 'yellow') {
                if (objects[i].score < .6 && objects[i].score > .3) {
                    output.push(objects[i])
                } 
            } else if (selection === 'red') {
                if (objects[i].score <= .3) {
                    output.push(objects[i])
                }
            }
        }

        this.setState({objectRecord: output})
    }

    // resets the object record to default every time the global view changes
    componentWillReceiveProps(nextProps) {
        if (nextProps.objectRecord !== this.state.objectRecord)
            this.setState({objectRecord: nextProps.objectRecord})
    }

    render() {
        const {objects, nextLevel, changeData} = this.props
        const objectRecord = this.state.objectRecord
        return (
            <div style={scrollStyle}>
                <div style={titleStyle}>
                    <p style={pStyle}>
                        {nextLevel ? (nextLevel + 's').toUpperCase() : 'AD'}
                    </p>
                </div>
                <div style={selectionStyle}>
                    <TaskBar filterLogo={filter} sortLogo={sort} sort={this.sort} filter={this.filter}/>
                </div>
                <div style={objectListStyle}>        
                    {objectRecord ? 
                    objectRecord.map((object) => (
                        <ObjectListItem 
                            changeData={changeData} 
                            object={object}
                            key={object.id}
                            nextLevel={nextLevel}
                        />
                    )) : objects.map((object) => (
                        <ObjectListItem 
                            changeData={changeData} 
                            object={object}
                            key={object.id}
                            nextLevel={nextLevel}
                        />
                    )) }
                </div>
            </div>
        )
    }
}

const scrollStyle = {
    height: '98.5%',
    width: '98%',
    margin: '0 auto',
    position: 'absolute',
    bottom: '0px',
    borderRadius: '5px 0',
    display: 'flex',
    flexDirection: 'column',
}

const titleStyle = {
    height: '6em',
    backgroundImage: 'linear-gradient(#6648B7, #7654D6)',
    borderRadius: '5px 5px 0 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
}

const pStyle = {
    color: 'white',
    margin: '0 auto',
    fontSize: '18px',
    fontWeight: 300,
    transform: 'translateY(20%)',
    letterSpacing: '2px'
}

const selectionStyle = {
    height: '4.25em',
    background: '#7654D6',
    borderTop: '1px solid #6749ba',
    borderBottom: '1px solid #6749ba'
}

const objectListStyle = {
    backgroundImage: 'linear-gradient(to right, #181818, #020202)',
    overflow: 'auto',
    height: '100%'
}

ObjectList.propTypess = {
    nextLevel: PropTypes.string.isRequired,
    changeData: PropTypes.func.isRequired
}

export default ObjectList
