import React, { Component } from 'react'
import { Button, Input, Form, FormGroup } from 'reactstrap';
import axios from 'axios';
import '../App.css';
export default class HomePage extends Component {

  state = {
    url: '',
    submitted: false,
    answerData: [],
    valid: true
  }
  
  onSubmit = e => {
    e.preventDefault();
    const position = this.state.url.lastIndexOf("q") + 1;
    const questionID = this.state.url.substring(position);
    if (this.state.url.length > 0 && /^\d+$/.test(questionID)) {
      axios.get(`./api/answers/${questionID}`)
        .then((response) => {
          console.log('reach')
          console.log(response.data)
          if (response.data.question !== undefined) {
            this.setState({
              valid: true,
              submitted: true,
              answerData: response.data
            });
          }
          else{
            this.setState({
              valid: false,
              submitted: false
            });
          }

        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
        });
    }
    else{
      this.setState({
        valid: false,
        submitted: false
      });
    }
  }


  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { answerData } = this.state;
    return (
      <div>
        <h3>Hello!</h3>
        <p className="lead">Unlock what has been forbidden. Open the closed doors and see the answers.</p>
        <hr className="my-2" />
        <p>Currently only supports Chegg Q&A. It does not support Textbook Answers, CourseHero, etc.</p>
        <Form
          onSubmit={this.onSubmit}>
          <FormGroup>
            <div className="form-row">
              <div className="col">
                <Input
                  type="url"
                  name="url"
                  minLength="5"
                  id="answer"
                  placeholder="Question URL"
                  onChange={this.onChange}
                />
              </div>
              <div className="col">
                <Button
                  color="dark"
                >Search</Button>
              </div>
            </div>
          </FormGroup>
        </Form>
        {!this.state.valid ? (
          <div className="display-linebreak">
            <h3>Invalid Url</h3>
          </div>
        ) : <br />}



        {this.state.submitted ? (
          <div className="display-linebreak">
            <h3>Question</h3>
            <div className="content" dangerouslySetInnerHTML={{__html: answerData.question}}></div>
            <h3>Answer</h3>
            <div className="content" dangerouslySetInnerHTML={{__html: answerData.answer}}></div>
          </div>
        ) : <br />}

        <div>

        </div>
      </div>
    )
  }
}