import React from 'react';

class WebSocketFacade {
  constructor(url) {
    this.isConnected = false;
    this.preconnectionBuffer = [];

    this.ws = new WebSocket(url);
    this.ws.addEventListener('open', (event) => {
      console.log('Connection opened', event);

      this.preconnectionBuffer.forEach(x => this.sendInternal(x));

      this.isConnected = true;
      this.preconnectionBuffer = [];
    });
    this.ws.addEventListener('closed', (event) => {
      console.log('Connection closed', event);
    });
  }

  send(data) {
    if (this.isConnected) {
      this.sendInternal(data);
    } else {
      this.preconnectionBuffer.push(data);
    }
  }

  sendInternal(data) {
    console.log('Sending message to server', event);
    this.ws.send(data);
  }

  onMessage(handler) {
    this.ws.addEventListener('message', handler);
  }
}


export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };

    this.ws = new WebSocketFacade('ws://toxon.co.uk:5000/ws');
    this.ws.onMessage((data) => {
      this.setState({
        ...this.state,
        messages: [
          ...this.state.messages,
          data,
        ],
      });
    });
  }

  sendMessage() {
    this.ws.send(this.messageInput.value);
    this.messageInput.value = '';
  }

  render() {
    return (<div>
      <h1>Chat</h1>
      <input ref={(input) => { this.messageInput = input; }} />
      <button onClick={() => this.sendMessage()}>Send</button>
      <ul>
        {this.state.messages.map((message, idx) => <li key={idx}>{message.data}</li>)}
      </ul>
    </div>);
  }
}
