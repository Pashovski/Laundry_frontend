considering the following code, what can be done to the iframe element in terms of CSS selectors, or other attirbutes or properties to move it left on the page:

static styles = [
  css`
  :host {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: calc(10px + 2vmin);
    color: #1a2b42;
    max-width: 100vw;
    margin: 0 auto;
    text-align: center;
    font-family: sans-serif;
  }      
  main {
    flex-grow: 1;
    padding: 30px; /* add some padding */
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
  `,
  customStyles
  ]
  render() {
    return html`
    <video autoplay muted loop id="myVideo">
      <source src="../assets/${ this.washerStatus }.mp4" type="video/mp4">
      Your browser does not support HTML5 video.
    </video>

      <main>
        <h1 class="title">${this.title}</h1>
        <h2>${this.washerStatus}</h2>
        <h3>${this.doneMessage}</h3>
        <iframe src="http://192.168.1.230:3000/d/vjVrzBxnk/shell?orgId=1&from=1677768727074&to=1677790327074" width="450" height="200" frameborder="0"></iframe>
    `;
  }