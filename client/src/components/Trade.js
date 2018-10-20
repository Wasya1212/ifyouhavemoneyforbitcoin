import React, { Component } from 'react';
import Modal from 'react-modal';

const tradeOptions = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

Modal.setAppElement('#root')

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cashOut: false,
      money: 0,
      bitcoin: 0
    };
  }

  handleSubmit (e) {
    e.preventDefault();
  }

  changeTradeType = () => {
    this.setState({
      money: 0,
      bitcoin: 0
    });
    this.setState({ cashOut: !this.state.cashOut });
  }

  handleBitcoinInput = e => {
    this.setState({
      money: 0,
      bitcoin: 0
    });
    this.setState({ money: e.currentTarget.value || 0 });
  }

  handleMoneyInput = e => {
    this.setState({
      money: 0,
      bitcoin: 0
    });
    this.setState({ bitcoin: e.currentTarget.value || 0 });
  }

  buyBitcoin = () => {
    this.setState({
      money: 0,
      bitcoin: 0
    });
    this.props.buyBitcoin(this.state.bitcoin);
  }

  cashOut = () => {
    this.setState({
      money: 0,
      bitcoin: 0
    });
    this.props.cashOut(this.state.money);
  }

  render() {
    return (
      <Modal isOpen={this.props.isOpen} style={tradeOptions}>
        {this.state.cashOut && (
          <div className="App-trade">
            <h2>Cash out</h2>
            <p className="trade-currency-count dolar">{this.props.user.money} → {(parseFloat(this.props.user.money) + parseFloat(this.state.money)).toFixed(2)}</p>
            <p className="trade-currency-count bitcoin">{this.props.user.bitcoins_count} → {(parseFloat(this.props.user.bitcoins_count) - parseFloat(this.state.money / this.props.bitcoin.cost)).toFixed(8)}</p>
            <button className="btn btn-change" onClick={this.changeTradeType}>Buy Bitcoin</button>
            <form onSubmit={this.handleSubmit}>
              <input onChange={this.handleBitcoinInput} placeholder="Enter value of dollars..." type="number" />
            </form>
            <div className="App-trade__control">
              <button className="btn btn-confirm" onClick={this.cashOut}>Confirm</button>
              <button className="btn btn-confirm" className="btn btn-close" onClick={this.props.closeTradeModal}>Cancel</button>
            </div>
          </div>
        )}
        {!this.state.cashOut && (
          <div className="App-trade">
            <h2>Buy Bitcoin</h2>
            <p className="trade-currency-count dolar">{this.props.user.money} → {(this.props.user.money - (this.state.bitcoin * this.props.bitcoin.cost)).toFixed(2)}</p>
            <p className="trade-currency-count bitcoin">{this.props.user.bitcoins_count} → {parseFloat(this.state.bitcoin) + parseFloat(this.props.user.bitcoins_count)}</p>
            <button className="btn btn-change" onClick={this.changeTradeType}>Cash out</button>
            <form onSubmit={this.handleSubmit}>
              <input onChange={this.handleMoneyInput} placeholder="Enter value of bitcoins..." type="number" />
            </form>
            <div className="App-trade__control">
              <button className="btn btn-confirm" onClick={this.buyBitcoin}>Confirm</button>
              <button className="btn btn-close" onClick={this.props.closeTradeModal}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    );
  }
}
