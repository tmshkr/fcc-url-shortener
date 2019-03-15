import React, { Component, Fragment } from 'react'
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      url: "",
      shurl_id: null,
      error: null
    }
    
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
  }
  
  onChange(e) {
    this.setState({ url: e.target.value })
  }
  
  onSubmit(e) {
    e.preventDefault();
    
    const { url } = this.state;
    
    axios
      .post('/api/shorturl/new', { url })
      .then(({ data }) => {
        const { shurl_id, error } = data
        this.setState({ shurl_id, error })
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  
  copyLink(e) {
    e.preventDefault()

    const { shurl_id } = this.state
    const link = document.createElement('textarea')
    const tooltip = document.createElement('div')
    
    tooltip.id = "tooltip"
    tooltip.style.top = `${e.clientY + 25}px`
    tooltip.style.left = `${e.clientX - 50}px`
    tooltip.innerText = "Link copied!"
    
    link.value = `https://fcc-shurl.glitch.me/${shurl_id}`
    
    document.body.appendChild(link)
    document.body.appendChild(tooltip)
    link.select()
    document.execCommand('copy')
    document.body.removeChild(link)
    tooltip.style.opacity = 0
    
    setTimeout(() => {
      document.body.removeChild(tooltip)
    }, 1000)
  }
  
  render() {
    const { url, shurl_id, error } = this.state
    const link = (
      <a
        href={`https://fcc-shurl.glitch.me/${shurl_id}`}
        onContextMenu={this.copyLink.bind(this)}
        target="_blank"
      >
        { `fcc-shurl.glitch.me/${shurl_id}` }
      </a>
    )
    

    return (
      <Fragment>
        <h2>
          { shurl_id ? link : error }
        </h2>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="url"
            value={url}
            onChange={this.onChange}
            placeholder="Enter URL to be shortened"
          />
          <button type="submit">Submit</button>
        </form>
      </Fragment>
    )
  }
}

export default App