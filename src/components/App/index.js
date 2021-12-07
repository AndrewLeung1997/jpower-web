import React, { useState, useEffect } from 'react'
import FileUpload from '../FileUpload'
import { MuiThemeProvider, createTheme } from '@material-ui/core/styles'
import { CssBaseline, CircularProgress } from '@material-ui/core'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import firebase from '../../firebase'
import Login from '../Login'
import Registration from '../Registration'
import Home from '../Home'
import Player from '../Player'
import Filter from '../Filter'
import File from '../File'
import Dashboard from '../Dashboard'
import UpdateVideoInfo from '../UpdateVideoInfo'
import All from '../All'
const theme = createTheme()

export default function App() {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false)

    useEffect(() => {
        firebase.isInitialized().then(val => {
            setFirebaseInitialized(val)
        })
    })


    return firebaseInitialized !== false ? (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <Router>
                <Switch>
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Registration} />
                    <Route exact path="/upload" component={FileUpload} />
                    <Route exact path="/file" component={File}></Route>
                    <Route exact path="/player/id/:id" component={Player}></Route>
                    <Route exact path="/" component={Home}></Route>
                    <Route exact path="/filter/category/:category" component={Filter}></Route>
                    <Route exact path="/uploads" component={File}></Route>
                    <Route exact path="/dashboard" component={Dashboard}></Route>
                    <Route exact path="/updateVideoInfo" component={UpdateVideoInfo}></Route>
                    <Route exact path="/all" component={All}></Route>
                </Switch>
            </Router>
        </MuiThemeProvider>
    ) : <div id="loader"><CircularProgress /></div>

}