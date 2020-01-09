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
    history: [], 
    objectRecord: null, // this stays null
  }

  // makes state the origin ad account
  goHome = () => this.changeView(this.state.history[0].id, this.state.history[0].level)
  
  // changes view to previous object in history
  goBack = () => {
    this.state.history.pop()
    var history = this.state.history
    this.changeView(history[history.length-1].id, history[history.length-1].level)
  }

  // defines state only when all call responses are loaded
  loadState = (incoming) => {  
    if (incoming.subLoaded && incoming.kpiLoaded) {
      this.setState({
        liveSub: incoming.sub,
        liveLevel: incoming.level,
        liveNextLevel: incoming.nextLevel,
        liveName: incoming.name,
        history: incoming.history,
        liveKPI: {
          clicks: incoming.KPI.clicks,
          impressions: incoming.KPI.impressions,
          purchases: incoming.KPI.purchases,
          reach: incoming.KPI.reach,
          revenue: incoming.KPI.revenue,
          spent: incoming.KPI.spent,
          costPerPurchase: incoming.KPI.costPerPurchase
        },
      })
    } 
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

  // changes the ad object in the view
  changeView = (id, level) => {
    // the incoming response object that will be loaded
    var incoming = {
      kpiLoaded: false,
      subLoaded: false,
      loadedMessage: '',
      sub: [],
      level: '',
      nextLevel: '',
      name: '',
      history: [],
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

    if (level === 'Ad Account') 
      incoming.history = [{id: id, level: level}]
    else {
      if (level !== null)
        incoming.history = [...this.state.history, {id: id, level: level}]
    }
    var rawLevel = this.getRawLevel(level)


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
          history: [{id: data[0].id, level: data[0].level}]
        }) 
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
                        <p>WEBSITE PURCHASES BY {liveNextLevel ? (liveNextLevel).toUpperCase() : null} NAME</p>
                        <PurchaseGraph data={liveSub} level={liveLevel}/>
                      </div>
                    </div>
                  </div>
                  <div className='rightGraph'>
                    <div id='graph'>
                      <div id='graphContent'>
                        <p>AMOUNT SPENT & REVENUE BY {liveNextLevel ? (liveNextLevel).toUpperCase(): null} NAME</p>
                        <ProfitGraph data={liveSub} level={liveLevel}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='specBar'> 
              {(liveLevel !== 'Ad Account') ? (<button onClick={this.goBack}>Back</button>) : false}
              <InfoCol liveKPI={liveKPI}/>
            </div>
          </div>
        </div>
      )
  }
}

export default App