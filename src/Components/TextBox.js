import React, { Component } from "react"

class TextBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: "",
      data: "",
    }
    this.changeText = this.changeText.bind(this)
  }
  componentDidMount() {
    this.toBottom()
  }
  changeText = e => {
    var textValue = e.target.value
    this.setState({ text: textValue })
  }
  onKeyPress = e => {
    if (e.which === 32) {
      this.setState({ data: this.state.data + this.state.text })
      this.setState({ text: "" })
      this.toBottom()
    }
  }
  toBottom = () => {
    var element = document.getElementById("data")
    var height = element.scrollHeight
    element.scrollTop = height
  }
  render() {
    return (
      <>
        <div
          id='data'
          style={{
            fontSize: "30px",
            margin: "20px",
            padding: "20px",
            paddingBottom: "60px",
            maxHeight: "400px",
            overflow: "auto",
            border: "1px solid gray",
          }}
        >
          {this.state.data}
        </div>
        <h1>
          Total Characters: {this.state.data.length} Total Words:{" "}
          {this.state.data.trim().split(" ").length}
        </h1>
        <div className='mx-auto' style={{ width: "35%", marginTop: "5%" }}>
          <input
            className='form-control'
            style={{
              width: "500px",
              padding: "20px",
              fontSize: "40px",
            }}
            value={this.state.text}
            type='text'
            placeholder='Start Typing...'
            autoFocus={true}
            onChange={this.changeText}
            onKeyPress={this.onKeyPress}
          />
        </div>
      </>
    )
  }
}

export default TextBox
