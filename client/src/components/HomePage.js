import React, { Component } from 'react'
import { Button, Input, Form, FormGroup } from 'reactstrap';
import axios from 'axios';
import '../App.css';
import CircularIndeterminate from './Spinner';
export default class HomePage extends Component {

  state = {
    url: '',
    submitted: false,
    answerData: [],
    valid: true,
    loading: false
  }
  
  onSubmit = e => {
    console.log('test1');
    this.setState({
      loading:true,
      submitted:false
    });
    e.preventDefault();
    const position = this.state.url.lastIndexOf("q") + 1;
    const questionID = this.state.url.substring(position);
    if (this.state.url.length > 0 && /^\d+$/.test(questionID)) {
      console.log('test1');
      axios.get(`./api/answers/${questionID}`)
        .then((response) => {
          console.log(response);
          if (response.data.question !== undefined) {
            this.setState({
              valid: true,
              submitted: true,
              answerData: response.data,
              loading: false
            });
          }
          else{
            this.setState({
              valid: false,
              submitted: false,
              loading: false
            });
          }

        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
          console.log(error.config);
        });
    }
    else{
      this.setState({
        valid: false,
        submitted: false,
        loading: false
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

        {this.state.loading ? (
          <CircularIndeterminate/>
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