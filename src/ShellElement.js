import { LitElement, html, css } from 'lit';
import { customStyles } from './styles/custom';

const host = `192.168.1.230`;
// const host = `localhost`;
const logo = new URL(
  '../assets/washing-machine-svgrepo-com.svg',
  import.meta.url
).href;

const dryImg = new URL('../assets/dry.jpeg', import.meta.url).href;

export class ShellElement extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      washerStatus: { type: String },
      showImage: { type: Boolean },
      doneMessage: { type: String },
    };
  }

  static styles = [
    css`
      :host {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: calc(10px + 2vmin);
        color: #cdb4db;
        max-width: 100vw;
        margin: 0 auto;
        text-align: center;
        font-family: sans-serif;
      }
      main {
        flex-grow: 1;
        padding: 30px; /* add some padding */
      }
      h3 {
        color: #bde0fe;
      }
      .title {
        color: #ffafcc;
      }
      #myVideo {
        width: 100vw;
        height: 100vh;
        object-fit: cover;
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: -1;
      }
      iframe-container {
        margin-top: 50px;
      }

      iframe {
        width: 450px;
        height: 400px;
        margin-top: 230px;
        margin-right: 1500px;
      }
    `,
    customStyles,
  ];

  constructor() {
    super();
    this.title = '221 Laundry';
    this.showImage = false;
    this.doneMessage = '';
    this.washerStatus = 'Washing';
  }

  updated(changedProperties) {
    if (changedProperties.has('washerStatus')) {
      this.shadowRoot.querySelector('video').load();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    const clientId = Date.now();
    let ws = new WebSocket(`ws://${host}:8000/ws/${clientId}`);

    ws.onopen = () => {
      ws.send('Hello, server!');
    };

    ws.onmessage = event => {
      let data;
      console.log(event.data);
      if (['idle', 'washing', 'outoforder'].includes(event.data)) {
        data = formatText(event.data);
      } else {
        data = JSON.parse(event.data)[0]['_value'];
      }
      if (data === 'Idle') {
        this.doneMessage = 'Load is finished';
      } else if (data === 'Washing') {
        this.doneMessage = 'Load is running';
      } else if (data === 'Out of order') {
        this.doneMessage = 'Machine is undergoing maintenance';
      }
      this.washerStatus = data;
      this.showImage = !this.showImage;
    };

    let reconnect = () => {
      setTimeout(() => {
        ws = new WebSocket(`ws://${host}:8000/ws/${clientId}`);
      }, 5000);
    };
    function formatText(text) {
      if (text === 'outoforder') {
        return 'Out of order';
      } else {
        return text.charAt(0).toUpperCase() + text.slice(1);
      }
    }
    ws.onclose = event => {
      console.log('WebSocket closed with code: ', event.code);
      reconnect();
    };
  }

  render() {
    return html`
      <video autoplay muted loop id="myVideo">
        <source src="../assets/${this.washerStatus}.mp4" type="video/mp4" />
        Your browser does not support HTML5 video.
      </video>

      <main>
        <h1 class="title">${this.title}</h1>
        <h2>${this.washerStatus}</h2>
        <h3>${this.doneMessage}</h3>
        <!-- <iframe
          src="http://192.168.1.230:3000/d/vjVrzBxnk/shell?orgId=1&from=1677768727074&to=1677790327074"
          width="450"
          height="200"
          frameborder="0"
        ></iframe> -->
      </main>
    `;
  }
}
// To run locally
// cd docker-compose/shell-element
// in a separate terminal
// cd docker-compose/app
// In /app run:
// uvc
// In /shell-element run:
// npm run start
