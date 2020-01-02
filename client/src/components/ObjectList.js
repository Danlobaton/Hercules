import React, { Component } from 'react'
import ObjectListItem from './ObjectListItem'
import filter from '../filter.png'
import sort from '../sort.png'
import TaskBar from './ListTaskBar'
import PropTypes from 'prop-types'

export class ObjectList extends Component {
    // Gets the title of the sub array of items 
    getTitle = () => {
        if (this.props.nextLevel) {
            return (this.props.nextLevel + 's').toUpperCase()
        } else {
            return 'AD'
        }
    }

    sort = () => console.log('sorting stuff yay')

    render() {
        const objects = this.props.data
        return (
            <div style={scrollStyle}>
                <div style={titleStyle}>
                    <p style={pStyle}>{this.getTitle()}</p>
                </div>
                <div style={selectionStyle}>
                    <TaskBar filterLogo={filter} sortLogo={sort} sort={this.sort} />
                </div>
                <div style={objectListStyle}>        
                    {objects.map((object) => (
                        <ObjectListItem 
                            changeData={this.props.changeData} 
                            object={object}
                            key={object.id}
                            nextLevel={this.props.nextLevel}
                        />
                    ))}
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
    left: '2%',
    borderRadius: '5px 0',
    display: 'flex',
    flexDirection: 'column',
}

const titleStyle = {
    height: '6em',
    backgroundImage: 'linear-gradient(#6648B7, #7452D1)',
    borderRadius: '5px 0 0 0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
}

const pStyle = {
    color: 'white',
    margin: '0 auto',
    fontSize: '18px',
    fontWeight: 350,
    transform: 'translateY(20%)',
    letterSpacing: '2px'
}

const selectionStyle = {
    height: '4.25em',
    background: '#7452D1',
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
