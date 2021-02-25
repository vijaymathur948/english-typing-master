import React, { Component } from "react"

class TextBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: "",
    }
    this.changeText = this.changeText.bind(this)
  }
  changeText = e => {
    var textValue = e.target.value
    this.setState({ text: textValue })
  }
  onKeyPress = e => {
    console.log(e.which)
    if (e.which === 32) this.setState({ text: "" })
  }
  render() {
    console.log(this.state.text)
    return (
      <div className='center mt-5'>
        <input
          style={{
            width: "30%",
            padding: "20px",
            fontSize: "40px",
          }}
          value={this.state.text}
          type='text'
          placeholder='Start Typing'
          onChange={this.changeText}
          onKeyPress={this.onKeyPress}
        />
      </div>
    )
  }
}

export default TextBox
