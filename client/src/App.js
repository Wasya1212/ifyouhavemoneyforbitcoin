import React, { Component } from 'react';
import axios from "axios";
import Highcharts from 'highcharts';
import {
  HighchartsChart,
  Chart,
  withHighcharts,
  XAxis, YAxis, Title,
  Legend,
  LineSeries,
  Tooltip
} from 'react-jsx-highcharts';
import { addDataPoint, createDataPoint } from './utils/data-helpers';
import AppHeader from './components/Header';
import AppFooter from './components/Footer';
import AppTrade from './components/Trade';
import './sass/index.sass';

const maxTablePoints = 50;
const startedMoney = 100000;

Highcharts.setOptions({
  chart: {
    height: (9 / 16 * 70) + '%'
  }
});

const calculateProfit = (startedMoney, currentMoney, bitcoinsCount, bitcoinPrice) => {
  return ((parseFloat(currentMoney) + (bitcoinsCount * bitcoinPrice)) - startedMoney).toFixed(2);
}

class App extends Component {

  constructor (props) {
    super(props);
    this.updateLiveData = this.updateLiveData.bind(this);
    this.handleStartLiveUpdate = this.handleStartLiveUpdate.bind(this);
    this.handleStopLiveUpdate = this.handleStopLiveUpdate.bind(this);

    this.state = {
      user: { username: 'Some User', money: startedMoney, bitcoins_count: 0, profit: 0 },
      bitcoin: { name: 'BTCUSD', fullName: 'Bitcoin', cost: 0, grow_vector: false },
      data: [],
      liveUpdate: false,
      isOpen: false
    };

    this.modal = null;
  }

  componentDidMount () {
    this.handleStartLiveUpdate();
  }

  updateLiveData () {
    const { data } = this.state;

    axios({
      method: 'post',
      url: '/',
      data: { time: Date.now() },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(({ data: bitcoin }) => {
      this.setState({
        bitcoin: Object.assign(this.state.bitcoin, {
          cost: bitcoin.cost,
          grow_vector: bitcoin.cost - this.state.bitcoin.cost >= 0 ? true : false}),
        user: Object.assign(this.state.user, { profit: calculateProfit(startedMoney, this.state.user.money, this.state.user.bitcoins_count, bitcoin.cost) })
      });
      return bitcoin.cost
    })
    .then(bitcoin => {
      this.setState({
        data: addDataPoint(data, createDataPoint(bitcoin))
      });
    })
    .then(() => {
      if (this.state.data.length > maxTablePoints) {
        this.setState({
          data: this.state.data.slice(1)
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
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

  buyBitcoin = bitcoins_count => {
    if (bitcoins_count * this.state.bitcoin.cost > this.state.user.money) {
      alert("Not enaught of money!");
      return;
    }

    this.setState({
      user: Object.assign(this.state.user, {
        money: parseFloat((this.state.user.money - (bitcoins_count * this.state.bitcoin.cost)).toFixed(2)),
        bitcoins_count: (parseFloat(this.state.user.bitcoins_count) + parseFloat(bitcoins_count)).toFixed(8)
      })
    });
    this.closeModal();
  }

  cashOut = money => {
    if (this.state.user.bitcoins_count - (money / this.state.bitcoin.cost) < 0) {
      alert("Not enaught of Bitcoins!");
      return;
    }

    this.setState({
      user: Object.assign(this.state.user, {
        bitcoins_count: (this.state.user.bitcoins_count - parseFloat(money / this.state.bitcoin.cost)).toFixed(8),
        money: (parseFloat(this.state.user.money) + parseFloat(money)).toFixed(2)
      })
    });
    this.closeModal();
  }

  showModal = () => {
    this.setState({
      isOpen: true
    });
  }

  closeModal = () => {
    this.setState({
      isOpen: false
    });
  }

  render() {
    const { data, liveUpdate } = this.state;

    return (
      <div className="app">
        <AppTrade user={this.state.user} bitcoin={this.state.bitcoin} isOpen={this.state.isOpen} closeTradeModal={this.closeModal} buyBitcoin={this.buyBitcoin} cashOut={this.cashOut} ref="modal" />

        <AppHeader user={this.state.user} startTrade={this.showModal} />

        <section className="App-crypto">
          <div className="App-crypto__user-profit dolar">You earned: <strong>{this.state.user.profit}</strong></div>
          {!this.state.bitcoin.grow_vector && (
            <div className="grow-vector grow-vector-down">↓↓↓</div>
          )}
          {this.state.bitcoin.grow_vector && (
            <div className="grow-vector grow-vector-up">↑↑↑</div>
          )}
        </section>

        <HighchartsChart>
          <Chart />

          <Title>{`${this.state.bitcoin.name} Course: ${this.state.bitcoin.cost}`}</Title>

          <Legend>
            <Legend.Title>Legend</Legend.Title>
          </Legend>

          <Tooltip valueSuffix=" USD" />

          <XAxis type="datetime">
            <XAxis.Title>Time</XAxis.Title>
          </XAxis>

          <YAxis>
            <YAxis.Title>Pressure (m)</YAxis.Title>
            <LineSeries name="Bitcoin" data={data} />
          </YAxis>
        </HighchartsChart>

        <div>
          {!this.state.liveUpdate && (
            <button className="btn btn-success" onClick={this.handleStartLiveUpdate}>Live update</button>
          )}
          {this.state.liveUpdate && (
            <button className="btn btn-danger" onClick={this.handleStopLiveUpdate}>Stop update</button>
          )}
        </div>

        <AppFooter />

      </div>
    );
  }
}

export default withHighcharts(App, Highcharts);
