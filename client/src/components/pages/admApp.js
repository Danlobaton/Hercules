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

export class App extends Component {
  state = {
    data: Data[0], // remove when MainGraph info is available
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
    liveAdAccounts: [],
    id: this.props.id,
    token: this.props.token,
    master: Data, // remove when ad account becomes array
    history: [Data[0]], // restructure history to work with api after ad account becomes array
    loggedIn: this.props.loggedIn,
    objectRecord: null
  }

  // makes state the origin ad account
  goHome = () => {
    this.changeView(this.state.liveAdAccounts[0].id, this.state.liveAdAccounts[0].level)
  }

  // gets children's level
  getNextLevel = (level) => {
    switch (true) {
      case (level === 'Ad Account') : return 'Campaign'
      case (level === 'Campaign') : return 'Ad Set'
      case (level === 'Ad Set') : return 'Ad'
      default : return null
    }
  }
  
  // returns raw level for api changes
  getRawLevel = (level) => {
    switch (true) {
      case (level === 'Ad Account') : return 'adaccount'
      case (level === 'Campaign') : return 'campaign'
      case (level === 'Ad Set') : return 'adset'
      default : return ''
    }
  }

  // changes the ad object in the view
  changeView = (id, level) => {
    var rawLevel = this.getRawLevel(level)
    this.state.history.push({id: id, level: level})
    fetch(`/getView?object_id=${id}&view=${rawLevel}&token=${this.state.token}`)
    .then(res => res.json())
    .then((data) => {
        this.setState({  
          liveSub: data,
        })
    })
    fetch(`/getKpis?object_id=${id}&view=${rawLevel}&token=${this.state.token}`)
    .then(res => res.json())
    .then((data) => {
      this.setState({
        liveLevel: data.level,
        liveNextLevel: this.getNextLevel(data.level),
        liveName: data.name,
        liveKPI: {
          clicks: data.clicks,
          impressions: data.impressions,
          purchases: data.purchases,
          reach: data.reach,
          revenue: data.revenue,
          spent: data.spend,
          costPerPurchase: data.cost_per_purchase
      }
      })
    })
  }

  // TODO test functionality
  // handles lists when they are null
  nullListHandle = (object) => {
    if (object) 
      return object
    else return []
  }

  // TODO might have to look over this when ad account endpoint returns array
  // initial call to get default data, always first ad account in array
  componentDidMount() {
    var adAccounts = this.state.liveAdAccounts
    fetch(`/getAccounts?user_id=${this.props.id}&token=${this.props.token}`)
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        this.setState({liveAdAccounts: data}) //makes live ad accounts equal to array of ad account info
        this.changeView(data[0].id, data[0].level)
    })
  }

  render() {
    const {liveName, liveKPI, liveLevel, liveNextLevel, liveSub, liveAdAccounts} = this.state
    return (
        <div className='app'>
          <Header 
            goHome={this.goHome}
            level={liveLevel}
            master={liveAdAccounts}
            changeAdAccount={this.changeView}
          />
          <div className='contentBox'>
            
            <div className='scroll'>
              <ObjectList 
                objects={liveSub}
                nextLevel={liveNextLevel}
                changeData={this.changeView}
                objectRecord={this.state.object}
              />
            </div>
            <div className='mainBox'>
              <div className='box'>
                <div id='title'>
                  <p id='normFont'>PREDICTIVE MODEL:</p>
                  <p id='mainFont'>{(liveName ? liveName : 'Name').toUpperCase()}</p>
                </div>
                <div className='actionBar'>
                  <MainDropdown />
                  <PerformanceBar level={liveLevel} sub={liveSub}/>
                </div>
                <MainGraph actual={this.state.data.actual} predicted={this.state.data.predicted} level={this.state.data.level}/>
                <div className='subGraphs'>
                  <div className='leftGraph'>
                    <div id='graph'>
                      <div id='graphContent'>
                        <p>WEBSITE PURCHASES BY {liveNextLevel? (liveNextLevel).toUpperCase() : null} NAME</p>
                        <PurchaseGraph data={this.nullListHandle(liveSub)} level={liveLevel}/>
                      </div>
                    </div>
                  </div>
                  <div className='rightGraph'>
                    <div id='graph'>
                      <div id='graphContent'>
                        <p>AMOUNT SPENT & REVENUE BY {liveNextLevel ? (liveNextLevel).toUpperCase(): null} NAME</p>
                        <ProfitGraph data={this.nullListHandle(liveSub)} level={liveLevel}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='specBar'> 
              <InfoCol liveKPI={liveKPI}/>
            </div>
          </div>
        </div>
      )
  }
}

export default App