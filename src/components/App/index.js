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
                    <Route exact path="/UploadFile" component={FileUpload} />
                    <Route exact path="/" component={FileUpload}></Route>
                    <Route exact path="/Player" component={Player}></Route>
                    <Route exact path="/Home" component={Home}></Route>
                </Switch>
            </Router>
        </MuiThemeProvider>
    ) : <div id="loader"><CircularProgress /></div>

}