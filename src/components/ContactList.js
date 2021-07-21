import * as React from "react";
import { Manager } from "@twilio/flex-ui";
import { Table, TableBody, TableHead, TableRow, TableCell, Button } from "@material-ui/core";

import formatPhoneNumber from "./helpers/formatPhoneNumber";
import CreateOutboundTask from "./helpers/CreateOutboundTask";

import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import './styles.css';

export default class ContactList extends React.Component {
    constructor() {
        super();

        this.state = {
            contacts: [],
        };

        const manager = Manager.getInstance();
        this.token = manager.user.token;

        this.serviceBaseUrl = process.env.REACT_APP_CALLCENTER_FUNCTIONS_BASEURL;
        this.deleteContact = this.deleteContact.bind(this);
    }

    async deleteContact(key) {
        try {
            await fetch(
                `${this.serviceBaseUrl}/callcenter/delete-contact?key=${encodeURIComponent(key)}&Token=${this.token}`);

            const contacts = this.props.contacts.filter((el) => {
                if (el.phone !== key) {
                    return el;
                }
            });
            this.props.action(contacts);

        } catch (error) {
            console.log(error);
            this.setState({
                error,
            });
        }
    }

    render() {
        let contactList = [];
        let contacts = this.props.contacts;

        if (Array.isArray(contacts) && contacts && contacts.length >= 1) {
            contactList = (contacts || []).map((contact) => {
                return (
                    <tr key={contact.phone}>
                        <td>{contact.fullname}</td>
                        <td>{contact.workerorder}</td>
                        <td> {formatPhoneNumber(contact.phone)}</td>
                        <td><CreateOutboundTask
                            fullname={contact.fullname}
                            destinationNumber={contact.phone}
                        />
                            <IconButton aria-label="delete" value={contact.phone} onClick={() =>
                                this.deleteContact(contact.phone)}>
                                <DeleteIcon />
                            </IconButton>
                        </td>

                    </tr>
                    // <TableRow key={contact.phone}>

                    //     <TableCell className="contactlisttablecell1" style={{width: "20%"}}>
                    //         {contact.fullname}
                    //     </TableCell>
                    //     <TableCell className="contactlisttablecell2" style={{width: "20%"}}>
                    //         {contact.workerorder}
                    //     </TableCell>
                    //     <TableCell className="contactlisttablecell2" style={{width: "20%"}}>
                    //         {formatPhoneNumber(contact.phone)}
                    //     </TableCell>
                    //     <TableCell className="contactlisttablecell2" style={{width: "30%"}}>
                    //         <CreateOutboundTask
                    //             fullname = {contact.fullname}
                    //             workerorder = {contact.workerorder}
                    //             destinationNumber={contact.phone}
                    //         />
                    //     </TableCell>
                    //     <TableCell className="contactlisttablecell2" style={{width: "8%"}}>
                    //         <IconButton aria-label="delete" value={contact.phone} onClick={() =>
                    //             this.deleteContact(contact.phone)}>
                    //             <DeleteIcon />
                    //         </IconButton>
                    //     </TableCell>
                    // </TableRow>
                );
            });
        } else {
            contactList = (
                <tr>
                    <td
                        style={{ marginTop: 15, background: "#00000033", padding: 15, borderRadius: 3, fontSize: "1.3em", }} >
                        No contacts
                    </td>
                </tr>
            );
        }

        return contactList;
    }
}
