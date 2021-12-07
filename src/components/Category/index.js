import React, { useEffect, useState } from 'react'
import { Typography, Paper, Card, CardActionArea, CardMedia, CardContent, Button, CardActions, CardHeader } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../../firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'

const styles = theme => ({
    root: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        [theme.breakpoints.up('auto' + theme.spacing.unit * 3 * 2)]: {
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        backgroundColor: 'black'
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5,
        [theme.breakpoints.up('auto' + theme.spacing.unit * 3 * 2)]: {
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        backgroundColor: 'black'
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        backgroundColor: 'black'
    },

    Card: {
        marginTop: theme.spacing.unit * 2,
        height: theme.spacing.unit * 42,
        backgroundColor: 'black'

    },
    Tag: {
        width: theme.spacing.unit * 10,
        backgroundColor: "#FFC0CB",
        textAlign: 'center',
        borderRadius: '6px',
        borderColor: '#ffffff',
    },
   
    CardMedia: {
        paddingLeft: theme.spacing.unit * 1,
        paddingRight: theme.spacing.unit * 1,
        paddingTop: theme.spacing.unit * 1
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        color: 'white'
    },

})


function category(props){
    const {classes} = props
}

