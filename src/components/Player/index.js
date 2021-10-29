import React, { useState } from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel, LinearProgress } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import ReactPlayer from 'react-player'
import Bar from '../Bar'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(700 + theme.spacing.unit * 3 * 2)]: {
            width: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    },

})

function Player(props) {

    const { classes } = props
    var url = props.match.params.videoURL

    return (

        <main className={classes.main}>
            <Bar></Bar>
            <Paper className={classes.paper}>
                <ReactPlayer
                    className="react-player"
                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                    onContextMenu={e => e.preventDefault()}
                    url="https://firebasestorage.googleapis.com/v0/b/jpower-8c20e.appspot.com/o/folder%2F15333670.mp4?alt=media&token=4739825a-13b9-4da7-b4fc-15d5f5f98344"
                    controls={true}
                    width="100%">
                </ReactPlayer>
            </Paper>
        </main>
        
    )
}


export default withRouter(withStyles(styles)(Player))