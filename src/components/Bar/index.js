import React, { useState, useEffect } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import { useTheme } from '@material-ui/core/styles';

import { Navbar, Nav, BSpan } from 'bootstrap-4-react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Home from '../Home'



function Bar(props) {

    return (

        <div>
            <Navbar expand="md" dark bg="dark" fixed="top">
                <Navbar.Brand href="/" style={{ paddingLeft: '50px', paddingRight: '60px' }}>JPower TV</Navbar.Brand>
                <Navbar.Toggler target="#navbarsExampleDefault" />

                <Navbar.Collapse id="navbarsExampleDefault">
                    <Navbar.Nav mr="auto">
                        <Nav.Link href="/">主頁</Nav.Link>
                        <Nav.Link href="/login">登入</Nav.Link>
                    </Navbar.Nav>
                    <Navbar.Text></Navbar.Text>
                </Navbar.Collapse>
            </Navbar>
        </div>
    )


}

export default withRouter((Bar))