import React, { useState, useEffect } from 'react'
import { AppBar, Divider, Drawer, Button, IconButton, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import MenuIcon from '@material-ui/icons/Menu';
import {  useTheme } from '@material-ui/core/styles';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import HistoryIcon from '@material-ui/icons/History';
import HomeIcon from '@material-ui/icons/Home';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import VideocamIcon from '@material-ui/icons/Videocam';

import clsx from 'clsx';
import { Videocam, VideocamOffRounded } from '@material-ui/icons';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
    },
    logo: {
        maxWidth: 40,
        marginRight: '10px'
    }
})

function Bar(props) {

    const { classes } = props
    const theme = useTheme()
    const [displayNavBar, setDisplayNavBar] = useState(false)
   
    const handleDrawerOpen = () => {
        setDisplayNavBar(true);
    };

    const handleDrawerClose = () => {
        setDisplayNavBar(false);
    };

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div className={classes.root}>
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: displayNavBar,
                })}>
                <Toolbar variant="dense">
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerOpen}
                        className={clsx(classes.menuButton, displayNavBar && classes.hide)}>
                        <MenuIcon />
                    </IconButton>
                    <img  className={classes.logo}></img>
                    <Typography variant="h6" className={classes.title} noWrap>
                        JPower
                    </Typography>
                    
                </Toolbar>
            </AppBar>

            <Drawer
                container={container}
                variant="persistent"
                anchor="left"
                open={displayNavBar}
                onClose={handleDrawerOpen}
                classes={{
                    paper: classes.drawerPaper
                }}

            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <Link to='/'>
                    <List>
                        <ListItem button key='Main'>
                            <ListItemIcon>
                                <Videocam />
                            </ListItemIcon>
                            <ListItemText primary="主頁" />
                        </ListItem>
                    </List>
                </Link>

            </Drawer>



        </div>
    )


}

export default withRouter(withStyles(styles)(Bar))