// general uploads
import React, { Component } from 'react'
import Data from '../data.json' // dummy data


// component imports
import Header from '../Header'
import ObjectList from '../ObjectList'
import MainDropdown from '../MainDropdown'
import PerformanceBar from '../PerformanceBar'
import MainGraph from '../MainGraph'
import PurchaseGraph from '../PurchaseGraph'
import InfoCol from '../InfoCol'
import ProfitGraph from '../ProfitGraph'

// TODO Facebook sign-in ;( I think that might have to lead some major restructure
export class App extends Component {
  // TODO get live data from api... might have to restructure the main state
  state = {
    data: Data[0],
    liveSub: [],
    liveKPI: {
        clicks: '',
        impressions: '',
        purchases: '',
        reach: '',
        revenue: '',
        spent: ''
    },
    liveName: '',
    liveLevel: '',
    liveNextLevel: '',
    master: Data,
    history: [Data[0]],
    loggedIn: this.props.loggedIn
  }

  // makes state the origin ad account
  goHome = () => {
    fetch('https://devhercules.herokuapp.com/account_state')
    .then(res => res.json())
    .then((data) => {
        this.setState({        
          liveSub: data.children_data,
            liveKPI: {
                clicks: data.object_data.clicks,
                impressions: data.object_data.impressions,
                purchases: data.object_data.purchases,
                reach: data.object_data.reach,
                revenue: data.object_data.revenue,
                spent: data.object_data.spend,
                costPerPurchase: data.object_data.cost_per_purchase
            },
            liveName: data.object_data.object_name,
            liveLevel: data.object_data.level,
            liveNextLevel: this.getNextLevel(data.object_data.level)
        })
    })
  }

  // gets children's level
  getNextLevel = (level) => {
    if (level === 'Ad Account') 
      return 'Campaign'
    else if (level === 'Campaign')
      return 'Ad Set'
    else if (level === 'Ad Set')
      return 'Ad'
    else 
      return null
  }
  
  // returns raw level for api changes
  getRawLevel = (level) => {
    if (level === 'Campaign') 
      return 'campaign'
    else if (level === 'Ad Set')
      return 'adset'
    else return ''
  }

  // changes the data to the object given
  changeData = (object) => {
    this.setState({data: object})
    this.state.history.push(object) // spread or push? idk lol, push for now - Eddie
  }

  // changes the ad object in the view
  changeView = (id, level) => {
    var rawLevel = this.getRawLevel(level)
    this.state.history.push({id: id, level: level})
    fetch(`https://devhercules.herokuapp.com/view_state?dev=true&object_id=${id}&view=${rawLevel}`)
    .then(res => res.json())
    .then((data) => {
        this.setState({  
          liveSub: data.children_data,
            liveKPI: {
                clicks: data.object_data.clicks,
                impressions: data.object_data.impressions,
                purchases: data.object_data.purchases,
                reach: data.object_data.reach,
                revenue: data.object_data.revenue,
                spent: data.object_data.spend,
                cost_per_purchase: data.object_data.cost_per_purchase
            },
            liveName: data.object_data.object_name,
            liveLevel: data.object_data.level,
            liveNextLevel: this.getNextLevel(data.object_data.level)
        })
    })
  }

  // changes ad account
  changeAdAccount = (object) => {
    this.setState({data: object})
    this.setState({history: [object]})
  }

  // goes to previous object in history
  // Do I still need this?
  goBack = () => {
    this.state.history.pop()
    this.setState({data: this.state.history[(this.state.history.length - 1)]})
  }

  nullListHandle = (object) => {
    if (object) {
      return object
    } else {
      return []
    }
  }

  componentDidMount() {
    fetch('https://devhercules.herokuapp.com/account_state')
    .then(res => res.json())
    .then((data) => {
        this.setState({        
          liveSub: data.children_data,
            liveKPI: {
                clicks: data.object_data.clicks,
                impressions: data.object_data.impressions,
                purchases: data.object_data.purchases,
                reach: data.object_data.reach,
                revenue: data.object_data.revenue,
                spent: data.object_data.spend,
                costPerPurchase: data.object_data.cost_per_purchase
            },
            liveName: data.object_data.object_name,
            liveLevel: data.object_data.level,
            liveNextLevel: this.getNextLevel(data.object_data.level)
        })
    })
}

  render() {
    return (
        <div className='app'>
          <Header 
            goHome={this.goHome}
            level={this.state.data.level}
            master={Data}
            changeAdAccount={this.changeAdAccount}
          />
          <div className='contentBox'>
            <div className='specBar'> 
              <InfoCol data={this.state.data} liveKPI={this.state.liveKPI}/>
            </div>
            <div className='mainBox'>
              <div className='box'>
                <div id='title'>
                  <p id='normFont'>PREDICTIVE MODEL:</p>
                  <p id='mainFont'>{(this.state.liveName).toUpperCase()}</p>
                </div>
                <div className='actionBar'>
                  <MainDropdown />
                  <PerformanceBar level={this.state.liveLevel} sub={this.state.liveSub}/>
                </div>
                <MainGraph actual={this.state.data.actual} predicted={this.state.data.predicted} level={this.state.data.level}/>
                <div className='subGraphs'>
                  <div className='leftGraph'>
                    <div id='graph'>
                      <div id='graphContent'>
                        <p>WEBSITE PURCHASES BY {this.state.data.sub ? (this.state.liveNextLevel).toUpperCase() : null} NAME</p>
                        <PurchaseGraph data={this.nullListHandle(this.state.liveSub)} level={this.state.data.level}/>
                      </div>
                    </div>
                  </div>
                  <div className='rightGraph'>
                    <div id='graph'>
                      <div id='graphContent'>
                        <p>AMOUNT SPENT & REVENUE BY {this.state.data.sub ? (this.state.liveNextLevel).toUpperCase(): null} NAME</p>
                        <ProfitGraph data={this.nullListHandle(this.state.liveSub)} level={this.state.data.level}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='scroll'>
              <ObjectList 
                data={this.state.liveSub}
                nextLevel={this.state.liveNextLevel}
                changeData={this.changeView}
              />
            </div>
          </div>
        </div>
      )
  }
}

export default App
