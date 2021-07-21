import * as React from "react";
import createContact from "./helpers/createContact";
import TableHeader from "./TableHeader";
import ContactList from "./ContactList";

import { Table, TableBody } from "@material-ui/core";
import { Manager } from "@twilio/flex-ui";
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import 'primeflex/primeflex.css';
import './styles.css';
import validatePhoneNumber from "./helpers/validatePhoneNumber";
require('dotenv').config();

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            fullname: "",
            workerorder: "",
            phoneNumber: "",
            invalidPhone: false,
            errors: []
        };

        const manager = Manager.getInstance();
        this.token = manager.user.token;

        this.serviceBaseUrl = process.env.REACT_APP_CALLCENTER_FUNCTIONS_BASEURL;
        this.updateFullName = this.updateFullName.bind(this);
        this.updateWorkerOrder = this.updateWorkerOrder.bind(this);
        this.updatePhone = this.updatePhone.bind(this);
        this.createContactClick = this.createContactClick.bind(this);

        this.handler = this.handler.bind(this);

    }

    handler(contacts) {

        this.setState({ contacts });
    }

    async componentDidMount() {
        try {
            const response = await fetch(
                `${this.serviceBaseUrl}/callcenter/get-contacts?Token=${this.token}`
            );
            const json = await response.json();
            //Deloyment code
            // this.setState({ contacts: JSON.parse(json) });
            //Local code
            this.setState({ contacts: json });
        } catch (error) {
            console.log('error', error);
        }
    }

    async createContactClick(event) {
        event.preventDefault();
        var fullnameInput = this.state.fullname; //document.getElementById('fullname');
        var workerorderInput = this.state.workerorder;//document.getElementById('workerorder');
        var phoneInput = this.state.phoneNumber;//document.getElementById('phoneNumber');

        var invalid = 0;
        var errors = this.state.errors;
        if (fullnameInput == '') {
            errors["fullname-error"] = "Full name is required";
            invalid = 1;
        }
        else {
            errors["fullname-error"] = '';
        }
        if (workerorderInput == '') {
            errors["workerorder-error"] = "Worker order is required";
            invalid = 1;
        }
        else {
            errors["workerorder-error"] = '';
        }
        if (validatePhoneNumber(phoneInput)) {
            if (invalid == 0) {
                document.getElementsByClassName('lds-roller')[0].style.display = 'block';
                createContact(fullnameInput, workerorderInput, phoneInput).then((data) => {
                    document.getElementsByClassName('lds-roller')[0].style.display = 'none';
                    if (data && data.isError) {
                        ;
                        alert("Contact already exists");
                    }
                    else {

                        let contacts = this.state.contacts;
                        let new_contacts = { phone: phoneInput, fullname: fullnameInput, workerorder: workerorderInput };
                        contacts.push(new_contacts);

                        this.setState({
                            fullname: "",
                            "workerorder": "",
                            phoneNumber: "",
                            contacts: contacts,
                            errors: [],
                        });

                    }
                });
            }
            errors["phone-error"] = "";
        }
        else {
            if (this.state.phoneNumber.startsWith("+1"))
                errors["phone-error"] = "Invalid phone number length, length should be 11 digits";
            else
                errors["phone-error"] = "Invalid phone number format. Valid format is +1xxxxxxxxxx";
            //this.setState({errors: errors});
        }

        this.setState({ errors: errors });

    }


    updateFullName(e) {
        this.setState({
            fullname: e.target.value,
        });
    }

    updateWorkerOrder(e) {
        this.setState({
            workerorder: e.target.value,
        });
    }

    updatePhone(e) {
        this.setState({
            phoneNumber: e.target.value,
            invalidPhone: false,
        });
    }

    render() {
        return (
            <div>
                <div className="lds-roller"><div></div><div></div><div></div></div>
                <Card title="Contact Details" subTitle="Enter the details and click on add button.">
                    <div className="p-grid p-dir-col">
                        <div className="p-col">
                            <div className="box">
                                <form onSubmit={this.createContactClick} className="p-formgroup-inline">
                                    <div className="p-field">
                                        <span className="p-float-label">
                                            <InputText id="fullname" type="text" value={this.state.fullname} onChange={this.updateFullName} />
                                            <label htmlFor="fullname">Full name</label>
                                        </span>
                                        <div style={{ color: "red", "fontSize": "12px" }}>{this.state.errors["fullname-error"]}</div>
                                    </div>
                                    <div className="p-field">
                                        <span className="p-float-label">
                                            <InputText id="workerorder" type="text" value={this.state.workerorder} onChange={this.updateWorkerOrder} />
                                            <label htmlFor="workerorder">Worker order</label>
                                        </span>
                                        <div style={{ color: "red", "fontSize": "12px" }}>{this.state.errors["workerorder-error"]}</div>
                                    </div>
                                    <div className="p-field">
                                        <span className="p-float-label">
                                            <InputText id="phoneNumber" type="text" value={this.state.phoneNumber} onChange={this.updatePhone} />
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                        </span>
                                        {/* <div>(+1xxxxxxxxxx)</div> */}
                                        <div style={{ color: "red", "fontSize": "12px" }}>{this.state.errors["phone-error"]}</div>

                                    </div>
                                    <Button type="submit" label="Add" className="p-button-raised p-button-rounded" />
                                </form>
                            </div>
                        </div>
                        <div className="p-col">
                            <div className="box">
                                <table id="user-contacts">
                                    <tbody>
                                        <tr>
                                            <th>Full name</th>
                                            <th>Worker order</th>
                                            <th>Phone number</th>
                                            <th>Actions</th>

                                        </tr>
                                    </tbody>
                                    <tbody>
                                        <ContactList contacts={this.state.contacts} action={this.handler} />
                                    </tbody>
                                </table>
                                {/* <Table aria-label="simple table">
                                    <TableHeader />
                                    <TableBody style={{ display: "block", overflowY: "auto", height: "70vh", }} >
                                        <ContactList contacts={this.state.contacts} action = {this.handler}  />
                                    </TableBody>
                                </Table> */}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        );
    }
}