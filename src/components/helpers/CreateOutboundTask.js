// import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import { Readable } from 'stream';
import React, { Component } from 'react';
import { Button } from 'primereact/button';
import { Manager, TaskListItem } from "@twilio/flex-ui";
import '../styles.css';

export default class CreateOutboundTask extends Component {

  constructor(props) {
    super(props);
    this.state = { disabled: false };

    const manager = Manager.getInstance();
    this.token = manager.user.token;
    this.createOutboundSMSTaskClick = this.createOutboundSMSTaskClick.bind(this);
  }

  checkSession() {
    // const userAvailable = TaskList.defaultProps
  }

  async createOutboundSMSTaskClick() {

    const toName = this.props.fullname;
    const toNumber = this.props.destinationNumber;
    const workerClient = Manager.getInstance().workerClient.attributes.contact_uri;
    const fromNumber = process.env.REACT_APP_TWILIO_NUMBER;
    const baseURL = process.env.REACT_APP_CALLCENTER_FUNCTIONS_BASEURL;
    // Manager.getInstance().strings.TaskLineSmsAssigned = "I am a content string!";
    // const manager = Manager.getInstance();
    // const token = manager.user.token;
    this.setState({ disabled: false });

    try {
      const response = await fetch(
        `${baseURL}/callcenter/create-outbound-sms-task`,
        {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Accept': "application/json, text/plain, */*",
            'Content-Type': "application/json"
          },
          body: JSON.stringify({ fromNumber, toName, toNumber, workerClient })
        })

        // console.log("responseBody",response.body);
      let responseBody = await response.json();
      if (responseBody.duplicate) {
        alert("Session already started for phone number: " + toNumber);
      }
      const newEntry = response.body;

      return newEntry;
    } catch (error) {
      console.log("create outbound---" + error);
      throw new Error(error);
    }
  }

  render() {
    return (
      <div className="dialog-demo">
        <div className="card">
          <Button label="Initiate Conversation" onClick={this.createOutboundSMSTaskClick} className="p-button-raised p-button-rounded" disabled={this.state.disabled} />
        </div>
        <div className="show-msg hide"></div>
      </div>
    )
  }
}
