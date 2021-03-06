import React, { Component } from "react"
import { Button, Form, Row, Col, Modal, Spinner } from "react-bootstrap"
import styled from "styled-components"
import { Link } from "react-router-dom"

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

      // some formatting relating tools
      case: false,
      lastWords: [],
    }
    this.changeText = this.changeText.bind(this)
    this.handleShow = this.handleShow.bind(this)
    this.handleClose = this.handleClose.bind(this)
  }

  toggleCase = () => {
    if (this.state.case) {
      this.setState({ modalData: this.state.modalData.toLowerCase() })
    } else {
      this.setState({ modalData: this.state.modalData.toUpperCase() })
    }
    this.setState({ case: !this.state.case })
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
    var result = this.state.modalData.replaceAll("\n", " ")

    result = result.split(" ").filter((word, index_1) => {
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
    setTimeout(() => {
      this.calculateLastWord()
    }, 1000)
  }
  calculateLastWord = () => {
    //  first reset the array before starting operations

    this.setState({ lastWords: [] })
    this.findOutLastWord()
  }
  saveModalData = e => {
    var data = e.target.value
    this.setState({ modalData: data })
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
  findOutLastWord_1 = () => {
    // 40px for left and right side padding
    // if we are adding scrollbar then we have to remove 23px from total width
    var totalWidth = document.getElementById("data").offsetWidth - 40
    this.state.data.map((word, index_1) => {
      var currentElementwidth = document.getElementById(index_1).offsetWidth
      //  10px is for margin from right side
      totalWidth -= currentElementwidth + 10
      if (totalWidth < 1) {
        this.setState({ lastWords: [...this.state.lastWords, index_1] })

        totalWidth = document.getElementById("data").offsetWidth - 40
        totalWidth -= currentElementwidth + 10
      }
    })
    this.setState({
      lastWords: [...this.state.lastWords, this.state.data.length],
    })
  }
  findOutLastWord = () => {
    var top = 0
    this.state.data.map((word, index_1) => {
      var currentElementTop = document.getElementById(index_1).offsetTop
      if (top !== currentElementTop) {
        top = currentElementTop

        if (index_1 - 1 > 0) {
          this.setState({ lastWords: [...this.state.lastWords, index_1] })
        }
      }
    })
    this.setState({
      lastWords: [...this.state.lastWords, this.state.data.length],
    })
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
      if (this.state.lastWords.includes(this.state.currentWordIndex)) {
        this.scrollTo(70)
        if (this.state.currentWordIndex === this.state.data.length) {
        }
      }
    }
  }
  scrollTo = value => {
    var element = document.getElementById("data")
    //    var height = element.scrollHeight
    element.scrollTop += value
  }
  importFile = e => {
    var str = "this is just a content"
    //    var fi = new Blob([str])
    // var fi = new File([str], "simple.txt")
    // console.log(fi)
    // fi.text()
    //   .then(response => console.log(response))
    //   .catch(error => console.log(error))

    var file = new FileReader()
    file.onload = e => {
      var text = e.target.result
      this.setState({ modalData: text })
    }
    file.readAsText(e.target.files[0])
  }
  exportFile = () => {
    if (this.state.modalData.trim()) {
      var fileName = "data.txt"
      var element = document.createElement("a")
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," +
          encodeURIComponent(this.state.modalData)
      )

      element.setAttribute("download", fileName)

      element.style.display = "none"
      document.body.appendChild(element)

      element.click()

      document.body.removeChild(element)
    }
  }
  render() {
    return (
      <div>
        <div
          id='data'
          style={{
            fontSize: "30px",
            margin: "20px",
            padding: "20px 20px 1px 40px",
            height: "234px",
            overflow: "hidden",
            border: "1px solid gray",
            borderRadius: "50px",
            backgroundColor: "darkslategray",
            scrollBehavior: "smooth",
          }}
        >
          {this.state.data.map((word, index_1) => {
            return (
              <h4
                key={index_1}
                id={index_1}
                style={{
                  backgroundColor:
                    index_1 === this.state.currentWordIndex
                      ? this.state.wrongWord
                        ? "red"
                        : "#007bff"
                      : "silver",
                  borderRadius: "50px",
                  padding: "10px",
                  marginRight: "10px",
                  marginBottom: "20px",
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

        <Row className='mt-4'>
          <Col lg='3' className='text-right'>
            <Button
              style={{
                fontSize: "35px",
                borderRadius: "50px",
                padding: "10px 70px",
              }}
              size='lg'
              onClick={this.handleShow}
            >
              Input
            </Button>

            <Modal
              size='lg'
              show={this.state.modalState}
              onHide={this.handleClose}
            >
              <Modal.Body>
                <Form.Group controlId='modal.data'>
                  <Form.Label>Paste the Paragraph</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={5}
                    value={this.state.modalData}
                    onChange={this.saveModalData}
                  />
                </Form.Group>
                <Form.Group style={{ display: "inline-flex" }}>
                  <Form.Group controlId='modal.case'>
                    <Form.Check
                      inline
                      type='checkbox'
                      checked={this.state.case}
                      onChange={this.toggleCase}
                      label='Toggle Case'
                    />
                  </Form.Group>
                  <Form.Group className='mx-2'>
                    <Form.File
                      id='modal.file'
                      onChange={this.importFile}
                      hidden={true}
                    />
                    <Button
                      onClick={() => {
                        var fileElement = document.getElementById("modal.file")
                        fileElement.click()
                      }}
                    >
                      Upload
                    </Button>
                  </Form.Group>

                  <Form.Group className='mx-2'>
                    <Button onClick={this.exportFile}>Download</Button>
                  </Form.Group>
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
          <Col lg='6'>
            <Form.Control
              style={{
                fontSize: "40px",
                padding: "30px",
                color: "white",
                backgroundColor: "#343a40",
                borderColor: "transparent",
                borderRadius: "50px",
                boxShadow: "none",
                textAlign: "center",
              }}
              placeholder={this.state.isTimerOn ? "" : "Start Typing..."}
              value={this.state.text}
              type='text'
              autoFocus={false}
              onChange={this.changeText}
              onKeyPress={this.onKeyPress}
            />
          </Col>
          <Col lg='3'>
            {!this.state.timerInput && (
              <Button
                variant='dark'
                size='lg'
                style={{
                  color: this.state.isTimerVisible ? "" : "#343A40",
                  fontSize: "35px",
                  borderRadius: "50px",
                }}
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
                style={{ fontSize: "35px", borderRadius: "50px" }}
                onChange={this.changeTimer}
                defaultValue={this.state.minutes}
              >
                <option value='1'>1</option>
                <option value='2'>2</option>
                <option value='4'>4</option>
                <option value='5'>5</option>
              </Form.Control>
            )}
            <Button
              variant='dark'
              size='lg'
              style={{
                fontSize: "35px",
                borderRadius: "50px",
              }}
              className='ml-2'
            >
              Refresh
            </Button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default TextBox
