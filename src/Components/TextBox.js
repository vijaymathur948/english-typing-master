import React, { Component } from "react"
import { Button, Form, Row, Col, Modal } from "react-bootstrap"
import styled from "styled-components"

class TextBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // textArea related variables
      text: "",
      data: [],
      currentWordIndex: 0,
      wrongWord: false,
      wrongWords: [],

      // timer related variables
      minutes: 1,
      seconds: 60,
      isTimerOn: false,
      isTimerVisible: true,
      timerReference: "",
      timerDisplayValue: "",

      // modal related variables
      modalState: false,
      modalData: "",

      // changing timer through conditional operator
      timerInput: false,
    }
    this.changeText = this.changeText.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }
  toggleTimerInput = () => {
    this.setState({ timerInput: !this.state.timerInput })
  }

  changeTimer = async e => {
    var minutes = Number(e.target.value)
    if (minutes !== undefined) await this.setState({ minutes: minutes })
    this.initializeTimer()
    this.toggleTimerInput()
  }

  filterDataAndSave = () => {
    var result = this.state.modalData.split(" ").filter((word, index_1) => {
      if (word !== "") return word
      return ""
    })

    this.setState({ data: result })
  }
  handleShow = () => {
    this.setState({ modalState: true })
  }
  handleClose = () => {
    this.setState({ modalState: false })
  }
  saveData = () => {
    this.filterDataAndSave()
    this.handleClose()
  }
  saveModalData = e => {
    var data = e.target.value.trim()
    data = data.replaceAll("\n", " ")
    if (data.length) this.setState({ modalData: data })
  }
  resetModalData = () => {
    this.setState({ modalData: "" })
    this.setState({ data: [] })
  }
  componentDidMount() {
    //this.scrollDown()
    //  initialize the timer default value with pading
    this.initializeTimer()
  }
  initializeTimer = () => {
    this.setState({ timerDisplayValue: this.state.minutes + ":00" })
  }
  toggleTimerVisibility = () => {
    this.setState({ isTimerVisible: !this.state.isTimerVisible })
  }
  startTimer = () => {
    this.setState({
      timerReference: setInterval(() => {
        this.setState({ seconds: this.state.seconds - 1 })
        var minutes = this.state.minutes - 1 + ":"
        var displayValue = this.state.seconds
        if (displayValue < 10) {
          displayValue = "0" + displayValue
        }
        var totalTime = minutes + displayValue
        this.setState({ timerDisplayValue: totalTime })

        if (this.state.seconds === 0) {
          clearInterval(this.state.timerReference)
          if (this.state.minutes !== 1) {
            this.setState({ minutes: this.state.minutes - 1 })
            this.startTimer()
          }
        }
      }, 1000),
    })
  }
  changeText = async e => {
    var textValue = e.target.value.trim()
    await this.setState({ text: textValue })

    // the word that we have typed
    var currentWord = this.state.text
    //  original word so that we can match
    var originalWord = this.state.data[this.state.currentWordIndex]

    if (originalWord !== undefined) {
      if (originalWord.substr(0, currentWord.length) !== currentWord) {
        this.setState({ wrongWord: true })
      } else {
        this.setState({ wrongWord: false })
      }
    }
  }
  toggleTimer = () => {
    this.setState({ isTimerOn: !this.state.isTimerOn })
  }
  onKeyPress = async e => {
    if (!this.state.isTimerOn) {
      this.startTimer()
      this.toggleTimer()
    }
    if (e.which === 32 && this.state.text) {
      // this method will be useful if you want to type
      // this.setState({ data: this.state.data + this.state.text })

      if (this.state.text !== this.state.data[this.state.currentWordIndex]) {
        await this.setState({ wrongWord: true })
      }

      if (this.state.wrongWord) {
        await this.setState({
          wrongWords: [...this.state.wrongWords, this.state.currentWordIndex],
        })
      }
      await this.setState({ currentWordIndex: this.state.currentWordIndex + 1 })
      // reset the flag

      this.setState({ text: "" })
      this.setState({ wrongWord: false })

      // after every words scrollDown function will be executed
      if (this.state.currentWordIndex % 50 === 0) {
        this.scrollDown()
      }
    }
  }
  scrollDown = () => {
    var element = document.getElementById("data")
    //    var height = element.scrollHeight
    var difference = 150
    element.scrollTop += difference
  }

  render() {
    return (
      <div>
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
            backgroundColor: "darkslategray",
            scrollBehavior: "smooth",
          }}
        >
          {this.state.data.map((word, index_1) => {
            return (
              <h4
                key={index_1}
                style={{
                  backgroundColor:
                    index_1 === this.state.currentWordIndex
                      ? this.state.wrongWord
                        ? "red"
                        : "#007bff"
                      : "silver",
                  borderRadius: "3px",
                  padding: "10px",
                  marginRight: "10px",
                  display: "inline-block",
                  color: this.state.wrongWords.includes(index_1)
                    ? "red"
                    : "dark",
                }}
              >
                {word}{" "}
              </h4>
            )
          })}
        </div>

        <Row>
          <Col lg='3' className='text-right'>
            <Button size='lg' onClick={this.handleShow}>
              User Input
            </Button>

            <Modal
              size='lg'
              show={this.state.modalState}
              onHide={this.handleClose}
            >
              <Modal.Body>
                <Form.Group controlId='exampleForm.ControlTextarea1'>
                  <Form.Label>Paste the Paragraph</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={5}
                    defaultValue={this.state.data.join(" ")}
                    onChange={this.saveModalData}
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant='danger' onClick={this.resetModalData}>
                  Reset
                </Button>

                <Button variant='secondary' onClick={this.handleClose}>
                  Close
                </Button>

                <Button variant='primary' onClick={this.saveData}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
          <Col lg='3'>
            <Form.Control
              style={{
                fontSize: "25px",
                fontWeight: "bold",
              }}
              value={this.state.text}
              type='text'
              autoFocus={false}
              onChange={this.changeText}
              onKeyPress={this.onKeyPress}
            />
          </Col>
          <Col lg='2'>
            {!this.state.timerInput && (
              <Button
                variant='dark'
                size='lg'
                style={{ color: this.state.isTimerVisible ? "" : "#343A40" }}
                onClick={this.toggleTimerVisibility}
                onDoubleClick={this.toggleTimerInput}
              >
                {this.state.timerDisplayValue}
              </Button>
            )}
            {this.state.timerInput && (
              <Form.Control
                as='select'
                size='lg'
                onChange={this.changeTimer}
                defaultValue={this.state.minutes}
              >
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </Form.Control>
            )}
          </Col>
        </Row>
      </div>
    )
  }
}

export default TextBox
