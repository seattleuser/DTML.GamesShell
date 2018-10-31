import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../css/BugReporter.css';
import postal from 'postal';
import 'bootstrap/dist/css/bootstrap.min.css';

class BugReporterContainer extends React.Component{
constructor (props) {
        super(props)
        this.state = {
            isHidden: true,
            config: props.config
        }
        this.channel = postal.channel('BugReporterVisibility');
        this.toggleHidden = this.toggleHidden.bind(this);
        this.hideToggle = this.hideToggle.bind(this);
        this.channel.subscribe( "togglevisibility", this.toggleHidden);
        this.channel.subscribe( "hidebar", this.hideToggle);
    }

    toggleHidden () {
        this.setState({
            isHidden: !this.state.isHidden
        })
    }

    hideToggle(){
        this.setState({isHidden: true});
    }
    render () {
        return (
            <div>
            {!this.state.isHidden && <BugReporter serverURL="https://dtml.org/api/UserService/RecordUserActivity" config = {this.state.config}/>}
            </div>
        )
    }
 }

class BugReporter extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      message: '',
      loading: false,
      visible: false,
      config: props.config
    };

    this.onMessageChange = this.onMessageChange.bind(this);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.channel = postal.channel('BugReporterVisibility');
  }

  onMessageChange(event) {
    this.setState({
      message: event.target.value
    });
  }

  async submit() {
    const message = this.state.message;

    this.setState({
      loading: true
    });

    try {     
      var url = new URL(this.props.serverURL);
      var params = {
        "eventType":"UserFeedbackSubmited",
        "EventData":JSON.stringify({"feedback":message})
      };
      url.search = new URLSearchParams(params);
      await fetch(url,  { credentials: 'include' });

    } catch (err) {
      console.error(err);
    }

    this.channel.publish("hidebar");

    this.setState({
      message: '',
      loading: false
    });
  }

  cancel() {
    this.setState({
      message: ''
    });
    this.channel.publish("hidebar");
  }

  render() {

    return (
      <div id="bug-reporter" className={classNames({ 'bug-reporter-loader': this.state.loading })}>
        <div className="title" class="label label-default">
        {this.state.config.bugreport}
        </div>

        <div className="field-group message-input">
          <textarea
            type="text"
            id="message"
            name="message"
            rows="1"
            value={this.state.message}
            onChange={this.onMessageChange}
          />
        </div>

        <div className="buttons-group">
          <div className="field-group submit-input">
            <button
              type="button"
              disabled={this.state.message === ''}
              onClick={this.submit} class="btn btn-info"
            >
            {this.state.config.submit}
            </button>
          </div>

          <div className="field-group cancel-input">
            <button
              type="button"
              onClick={this.cancel} class = "btn btn-info"
            >
              {this.state.config.cancel}
            </button>
          </div>
        </div>
      </div>
    );
  }

}

BugReporter.propTypes = {
  serverURL: PropTypes.string.isRequired
};

export default BugReporterContainer;
