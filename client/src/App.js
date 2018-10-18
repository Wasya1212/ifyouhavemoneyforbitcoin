// import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
//
// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <p>
//             Edit <code>src/App.js</code> and save to reload.
//           </p>
//           <a
//             className="App-link"
//             href="https://reactjs.org"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//     );
//   }
// }
//
// export default App;


import React, { Component } from 'react';
import axios from "axios";
import Highcharts from 'highcharts';
import {
  HighchartsChart, Chart, withHighcharts, XAxis, YAxis, Title, Legend, LineSeries
} from 'react-jsx-highcharts';

import { createRandomData, addDataPoint, getBitcoinData } from './components/data-helpers';

class App extends Component {

  constructor (props) {
    super(props);
    this.updateLiveData = this.updateLiveData.bind(this);
    this.handleStartLiveUpdate = this.handleStartLiveUpdate.bind(this);
    this.handleStopLiveUpdate = this.handleStopLiveUpdate.bind(this);

    const now = Date.now();
    this.state = {
      data: createRandomData(now),
      liveUpdate: false
    };
  }

  componentDidMount () {
    this.handleStartLiveUpdate();
  }

  updateLiveData () {
    const { data } = this.state;
    const time = Date.now();

    // axios
    //   .post('https://ifyouhavemoneyforbitcoin.herokuapp.com', { time: Date.now() })
    //   .then(({ data: bitcoin }) => {
    //     console.log("sdf", bitcoin);
    //     return bitcoin.cost
    //   })
    //   .then(bitcoin => {
    //     this.setState({
    //       data: addDataPoint(data, bitcoin, time)
    //     });
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });

    axios({
      method: 'post', //you can set what request you want to be
      // url: 'https://ifyouhavemoneyforbitcoin.herokuapp.com',
      url: '/',
      data: { time: Date.now() },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(({ data: bitcoin }) => {
      return bitcoin.cost
    })
    .then(bitcoin => {
      this.setState({
        data: addDataPoint(data, bitcoin, time)
      });
    })
    .catch(err => {
      console.error(err);
    });

    // getBitcoinData(time)
    //   .then(bitcoin => {
    //     console.log(bitcoin);
    //     this.setState({
    //       data: addDataPoint(data, bitcoin,time)
    //     });
    //   });
  }

  handleStartLiveUpdate (e) {
    e && e.preventDefault();
    this.setState({
      liveUpdate: window.setInterval(this.updateLiveData, 2000)
    });
  }

  handleStopLiveUpdate (e) {
    e.preventDefault();
    window.clearInterval(this.state.liveUpdate);
    this.setState({
      liveUpdate: false
    });
  }

  render() {
    const { data, liveUpdate } = this.state;

    return (
      <div className="app">

        <HighchartsChart>
          <Chart />

          <Title>Cryptocurrency course</Title>

          <Legend>
            <Legend.Title>Legend</Legend.Title>
          </Legend>

          <XAxis type="datetime">
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis>
            <YAxis.Title>Pressure (m)</YAxis.Title>
            <LineSeries name="Bitcoin" data={data} />
          </YAxis>
        </HighchartsChart>

        <div>
          {!liveUpdate && (
            <button className="btn btn-success" onClick={this.handleStartLiveUpdate}>Live update</button>
          )}
          {liveUpdate && (
            <button className="btn btn-danger" onClick={this.handleStopLiveUpdate}>Stop update</button>
          )}
        </div>

      </div>
    );
  }
}

export default withHighcharts(App, Highcharts);
