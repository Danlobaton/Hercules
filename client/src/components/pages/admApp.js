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
import GraphIcon from '../../graph.png'
import AppHeader from '../AppHeader'

export class App extends Component {
  state = {
    data: [], // remove when MainGraph info is available
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
    history: [], 
    objectRecord: null, // this stays null
    loaded: false, // use for loading state
    liveCurrent: [],
    currentActive: false
  }

  // makes state the origin ad account
  goHome = () => this.changeView(this.state.history[0].id, this.state.history[0].level, this.state.history[0].name)
  
  // changes view to previous object in history
  goBack = () => {
    var history = this.state.history
    
    history.pop()
    this.changeView(history[history.length-1].id, history[history.length-1].level, history[history.length-1].name)
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
  
  // returns appropriate view variable for API call
  getRawLevel = (level) => {
    switch (true) {
      case (level === 'Ad Account') : return 'adaccount'
      case (level === 'Campaign') : return 'campaign'
      case (level === 'Ad Set') : return 'adset'
      default : return ''
    }
  }
  
  // defines state only when all call responses are loaded
  loadState = (incoming) => {  
    if (incoming.subLoaded && incoming.kpiLoaded && incoming.currentLoaded) {
      this.setState({
        liveSub: incoming.sub,
        liveLevel: incoming.level,
        liveNextLevel: incoming.nextLevel,
        liveName: incoming.name,
        history: incoming.history,
        liveCurrent: incoming.liveCurrent,
        currentActive: incoming.currentActive,
        liveKPI: {
          clicks: incoming.KPI.clicks,
          impressions: incoming.KPI.impressions,
          purchases: incoming.KPI.purchases,
          reach: incoming.KPI.reach,
          revenue: incoming.KPI.revenue,
          spent: incoming.KPI.spent,
          costPerPurchase: incoming.KPI.costPerPurchase
        },
        data: Data[0]
      })
    } 
  }

  // changes the ad object in the view
  changeView = (id, level, name, subMessage) => {
    // remove later
    if (subMessage) console.log(subMessage)
    // the incoming response object that will be loaded
    var incoming = {
      kpiLoaded: false,
      subLoaded: false,
      currentLoaded: false,
      currentActive: false,
      loadedMessage: '',
      sub: [],
      level: '',
      nextLevel: '',
      name: '',
      history: [],
      liveCurrent: [],
      KPI: {
        clicks: '',
        impressions: '',
        purchases: '',
        reach: '',
        revenue: '',
        spent: '',
        costPerPurchase: ''
      }
    }
    
    // checks history to see what needs to be modified
    if (level === 'Ad Account') 
    incoming.history = [{id: id, level: level, name: name}]
    else if (level !== this.state.history[this.state.history.length-1].level) {
      incoming.history = [...this.state.history, {id: id, level: level, name: name}]
    } else {
      incoming.history = this.state.history
    }
    var rawLevel = this.getRawLevel(level)
    
    // gets current data
    if (rawLevel === 'campaign') {
      fetch(`/getCurrent?view=${rawLevel}&object_id=${id}&user_id=${this.state.id}&parent_id=${this.state.history[0].id}`)
      .then(res => res.json())
      .then(data => {
        incoming.currentLoaded = true
        incoming.currentActive = true
        incoming.liveCurrent = data
        this.loadState(incoming)
      })
    } else {
      incoming.currentLoaded = true
    }
    
    // gets current ad objects children
    fetch(`/getView?object_id=${id}&view=${rawLevel}&token=${this.state.token}`)
    .then(res => res.json())
    .then((data) => { 
      incoming.sub = data
      incoming.subLoaded = true 
      this.loadState(incoming)
    })
    
    // gets current ad objects Kpis
    fetch(`/getKpis?object_id=${id}&view=${rawLevel}&token=${this.state.token}`)
    .then(res => res.json())
    .then((data) => {
      incoming.level = data.level
      incoming.nextLevel = this.getNextLevel(data.level)
      incoming.name = data.name
      incoming.KPI = {
        clicks: data.clicks,
        impressions: data.impressions,
        purchases: data.purchases,
        reach: data.reach,
        revenue: data.revenue,
        spent: data.spend,
        costPerPurchase: data.cost_per_purchase
      }
      incoming.kpiLoaded = true
      this.loadState(incoming)
    })
  }
  
  // Initializes the ad account list and changes view to first ad account in list
  componentDidMount() {
    fetch(`/getAccounts?user_id=${this.props.id}&token=${this.props.token}`)
    .then(res => res.json())
    .then((data) => {
        this.setState({
          liveAdAccounts: data,
          history: [{id: data[0].id, level: data[0].level, name: data[0].name}]
        }) 
        this.changeView(data[0].id, data[0].level, data[0].name) 
    })
  }

  // Temporary Fucntion
  passDownName = () => {
    const history = this.state.history
    if (history[0]) {
      if (history[history.length-1].level) {
        return history[history.length-1].name
      } else { return 'Name' }
    } else { return 'Name' }
  }

  // Temporary Function
  passDownLevel = (isNext) => {
    const history = this.state.history
    if (history[0]) {
      if(history[history.length-1].level) {
        return isNext ? this.getNextLevel(history[history.length-1].level) : history[history.length-1].level
      }
    } else { return null }
  }

  render() {
    const {liveName, liveKPI, liveLevel, liveNextLevel, liveSub, 
          liveAdAccounts, objectRecord, history, liveCurrent, currentActive} = this.state
    console.log(history[0] ? history[0].id : null, liveCurrent)
    return (
        <div className='app'>
          <AppHeader 
            goHome={this.goHome}
            level={liveLevel}
            master={liveAdAccounts}
            changeAdAccount={this.changeView}
            history={history}
          />
          <div className='contentBox'>
            
            <div className='scroll'>
              <ObjectList 
                objects={liveSub}
                nextLevel={liveNextLevel ? liveNextLevel : this.passDownLevel(true)}
                changeData={this.changeView}
                objectRecord={objectRecord}
              />
            </div>
            <div className='mainBox'>
              <div className='box'>
                <div id='title'>
                  <p id='normFont'>PREDICTIVE MODEL:</p>
                  <p id='mainFont'>{(liveName ? liveName : this.passDownName()).toUpperCase()}</p>
                </div>
                <div className='actionBar'>
                  <MainDropdown />
                  <PerformanceBar level={liveLevel} sub={liveSub}/>
                </div>
                <MainGraph 
                  actual={this.state.data.actual} 
                  predicted={this.state.data.predicted} 
                  level={this.state.data.level}
                  current={liveCurrent}
                  currentActive={currentActive}
                />
                <div className='subGraphs'>
                  <div className='leftGraph'>
                    <div id='graph'>
                      <div id='graphContent'>
                        <div id='gTitle'>
                          <p>WEBSITE PURCHASES BY {liveNextLevel ? (liveNextLevel).toUpperCase() : null} NAME</p>
                          <img src={GraphIcon} height='16' alt='G' />
                        </div>
                        <PurchaseGraph data={liveSub} level={liveLevel}/>
                      </div>
                    </div>
                  </div>
                  <div className='rightGraph'>
                    <div id='graph'>
                      <div id='graphContent'>
                        <div id='gTitle'>
                          <p>AMOUNT SPENT & REVENUE BY {liveNextLevel ? (liveNextLevel).toUpperCase(): null} NAME</p>
                          <img src={GraphIcon} height='16' alt='G'/>
                        </div>
                        <div className='legend'>
                          <div id='legendModule'>
                            <div className='amountIcon'/>Amount Spent
                          </div>
                          <div id='legendModule'>
                            <div className='revenueIcon'/>Revenue
                          </div>
                        </div>
                        <ProfitGraph data={liveSub} level={liveLevel}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='specBar'> 
              {(liveLevel ? liveLevel : this.passDownLevel()) !== 'Ad Account' ? (<button onClick={this.goBack}>Back</button>) : false}
              <InfoCol liveKPI={liveKPI}/>
            </div>
          </div>
        </div>
      )
  }
}

export default App