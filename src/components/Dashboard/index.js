import React, { useState, useEffect } from 'react'
import { Paper, Button, Typography, TableContainer, TableHead, TableRow, TableCell, Table, TableBody, TablePagination, IconButton } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import Bar from '../Bar'
import InsertLinkIcon from '@material-ui/icons/InsertLink'
import PublishIcon from '@material-ui/icons/Publish';
import '../Player/style.css'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        [theme.breakpoints.up('auto' + theme.spacing.unit * 3 * 2)]: {
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 6,
        marginBottom: theme.spacing.unit * 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        border: '2px',
        marginTop: theme.spacing.unit,
        paddingBottom: '10px'
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        width: '200px'
    },
    tableHeader: {
        fontSize: '15px'
    }
});

function Dashboard(props) {
    const { classes } = props

    const [video, setVideo] = useState([])
    const [pageNumber, setPageNumber] = useState(0)
    const [totalDataCount, setTotalDataCount] = useState(0)
    const [dataRange, setDataRange] = useState(5)


    useEffect(() => {
        fetchAllVideo()
    }, [pageNumber, totalDataCount, dataRange])

    if (!firebase.auth().currentUser) {
        // not logged in
        alert('Please login first')
        props.history.replace('/login')
        return null
    }

    return (
        <main className={classes.main}>
            <Bar></Bar>
            <a href="/file" type="button" className="btn btn-primary" style={{ marginTop: '80px' }} >Upload File</a>
            <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">上載日期</TableCell>
                            <TableCell align="center">連結</TableCell>
                            <TableCell align="center">影片標題</TableCell>
                            <TableCell align="center">類別</TableCell>
                            <TableCell align="center">標籤</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {video.map(function (value, key) {
                            return (
                                <TableRow key={key}>
                                    <TableCell align="center">{value.id}</TableCell>
                                    <TableCell align="center">{convertTimeStamp(value.timestamp)}</TableCell>
                                    <TableCell align="center" value={value.url}>
                                        <IconButton
                                            component={Link}
                                            to={{
                                                pathname: `${value.url}`

                                            }}>
                                            <InsertLinkIcon color="primary" />
                                        </IconButton>
                                    </TableCell>
                                    <TableCell align="center">{value.fileName}</TableCell>
                                    <TableCell align="center">{value.category}</TableCell>
                                    <TableCell align="center">
                                        <div className="box">
                                            {value.tag !== undefined ? value.tag.map(function (value, index) {
                                                return (

                                                    <div className="tag">
                                                        <button id={index} style={{ paddingLeft: '2px' }}
                                                        >{value}</button>
                                                    </div>

                                                )
                                            }) : <div></div>}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center" >
                                        <IconButton component={Link} to={{
                                            pathname: `/updateVideoInfo`,
                                            state: {
                                                url: value.url
                                            }
                                        }}>
                                            <PublishIcon color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalDataCount}
                    onChangePage={handlePageChange}
                    onChangeRowsPerPage={(e) => handleRowsPerPageChange(e)}
                    page={pageNumber}
                    rowsPerPage={dataRange}
                    rowsPerPageOptions={[5, 10]}
                />
            </TableContainer>

        </main>
    )

    function handlePageChange(event, page) {
        setPageNumber(page)
        
    }

    function handleRowsPerPageChange(event) {
        setDataRange(event.target.value)
    }


    function paginate(array, page_size, page_number) {

        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    function fetchAllVideo() {
        var videoArray = []
        var today = getTodayDate()
        console.log(today)
        firebase.database().ref('VideoList/').orderByChild('timestamp').on('value', function (snapshot) {
            if (snapshot.val()) {
                var keys = Object.keys(snapshot.val()).sort()
                setTotalDataCount(keys.length)
                var key = keys[pageNumber * dataRange]
                snapshot.forEach(function (video) {
                    videoArray.push(video.val())
                })
                setVideo(paginate(videoArray, dataRange, pageNumber + 1))
            }
        })
        
    }

    function updateWatchingCount(){
        
    }

    function convertTimeStamp(timestamp) {
        var date = new Date(timestamp)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()

        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }

        var newDate = year + '-' + month + '-' + day

        return newDate
    }

    function getTodayDate() {
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()

        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }

        var newDate = year + '-' + month + '-' + day

        return newDate
    }

}


export default withRouter(withStyles(styles)(Dashboard))