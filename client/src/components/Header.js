import React, { Component } from 'react';

class AppHeader extends Component {
  constructor(props) {
    super(props);
  }

  startTrade = () => {
    this.props.startTrade();
  }

  render() {
    return (
      <header className="App-header">
        <article className="App-header__App-logo">
          <a href="/"><img src="/logo.png" alt="logo"/></a>
        </article>
        <article className="App-header__App-user">
          <div className="App-user-profile">
            <div className="App-user-profile__start-trade">
              <button className="btn btn-trading" onClick={this.startTrade}>Trade</button>
            </div>
            <div className="App-user-profile__money dolar">{this.props.user.money}</div>
            <div className="App-user-profile__bitcoins bitcoin">{this.props.user.bitcoins_count}</div>
            <div className="App-user-profile__info">
              <div className="App-user-profile__picture">
                <a href="/"><img src="/avatar.png" alt="avatar"/></a>
              </div>
              <div className="App-user-profile__username">
                <a href="/"><span>{this.props.user.username}</span></a>
              </div>
            </div>
          </div>
        </article>
      </header>
    );
  }
}

export default AppHeader;
