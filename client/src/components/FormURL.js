import React, { Component } from 'react'
import { Button, Input, Form, FormGroup } from 'reactstrap';
import axios from 'axios';
import '../App.css';
export default class FormURL extends Component {

  state = {
    url: '',
    submitted: false,
    answerData: [],
    valid: true
  }

  onSubmit = e => {
    e.preventDefault();
    if (this.state.url.length > 0) {
      const position = this.state.url.lastIndexOf("q") + 1;
      const questionID = this.state.url.substring(position);
      axios.get(`./api/answers/${questionID}`)
        .then((response) => {
          // handle success
          if (response.data[0] !== undefined) {
            this.setState({
              valid: true,
              submitted: true,
              answerData: response.data[0]
            });
          }


        })
        .catch((error) => {
          // handle error
          this.setState({
            valid: false,
            submitted: false
          });
          console.log(error);
        })
        .then(() => {
          // always executed

        });
    }
  }


  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { answerData } = this.state;
    const { picture } = answerData;
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