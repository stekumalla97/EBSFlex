import * as React from "react";
import { TableHead, TableRow, TableCell } from "@material-ui/core";
import './styles.css';

export default class TableHeader extends React.Component {
    constructor() {
        super();
    }

    render() {
        return (

            <TableHead style={{ display: "block" }}>
                <TableRow>
                    <TableCell className="tablecell1" style={{ width: "20%" }}> Full name </TableCell>
                    <TableCell className="tablecell2" style={{ width: "20%" }}> Worker order </TableCell>
                    <TableCell className="tablecell3" style={{ width: "20%" }}> Phone number </TableCell>
                    <TableCell className="tablecell4" style={{ width: "30%" }}> Actions </TableCell>
                    <TableCell className="tablecell4" style={{ width: "8%" }}></TableCell>
                </TableRow>
            </TableHead>
        );
    }
}
