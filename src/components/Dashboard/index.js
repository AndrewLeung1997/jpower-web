import React, { useState, useEffect } from 'react'
import { Paper, Button, Typography, TableContainer, TableHead, TableRow, TableCell, Table, TableBody, TablePagination, IconButton } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import Bar from '../Bar'
import InsertLinkIcon from '@material-ui/icons/InsertLink'
import PublishIcon from '@material-ui/icons/Publish';


const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
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
    const [dataRange] = useState(10)
    const [category, setCategory] = useState('')
    const [id, setId] = useState('')
    const [fileName, setFileName] = useState('')

    useEffect(() => {
        fetchAllVideo()
    }, [pageNumber, totalDataCount])


    return (
        <main className={classes.main}>
            <Bar></Bar>
            <div style={{ paddingTop: "80px" }}>
                <nav>
                    <ul className="pagination justify-content-end">
                        {
                            Array(Math.ceil(totalDataCount/dataRange)).fill().map(function (_, i) {
                                return (
                                    <div className="pangination" style={{ borderRadius: "20px", paddingLeft: "5px", fontWeight: "bold" }}>
                                        <li className="page-item" key={i} onClick={() => setPageNumber(i)}>
                                            <a className="page-link" href="#">{i + 1}</a>
                                        </li>
                                    </div>
                                )
                            })
                        }
                    </ul>
                </nav>
            </div>
            <TableContainer component={Paper} style={{ marginTop: '30px' }}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center" >ID</TableCell>
                            <TableCell align="center">Upload Date</TableCell>
                            <TableCell align="center">Link</TableCell>
                            <TableCell align="center" >Video Name</TableCell>
                            <TableCell align="center" >Category</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {video.map(function (value, key) {
                            return (
                                <TableRow key={key}>
                                    <TableCell align="center" contentEditable={true} onChange={e=> setId(e.target.value)}>{value.id}</TableCell>
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
                                    <TableCell align="center" contentEditable={true} onChange={e=>setFileName(e.target.value)}>{value.fileName}</TableCell>
                                    <TableCell align="center" contentEditable={true} onChange={e=>setCategory(e.target.value)}>{value.category}</TableCell>
                                    <TableCell align="center" >
                                        <IconButton>
                                            <PublishIcon color="primary" onClick={handleSubmitChange}/>
                                        </IconButton>
                                    </TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </main>
    )

    function onPageChange() {
        console.log("fuck you matai")
    }

    function fetchAllVideo() {
        firebase.database().ref('VideoList/').on('value', function (snapshot) {
            if (snapshot.val()) {
                var keys = Object.keys(snapshot.val()).sort()
                setTotalDataCount(keys.length)
                const dataArray = []
                var key = keys[pageNumber * dataRange]
                firebase.database().ref('VideoList/').orderByKey().limitToFirst(dataRange).startAt(key).on('value', function (snapshot) {
                    if (snapshot.val()) {
                        snapshot.forEach(function (result) {
                            dataArray.push(result.val())
                        })
                        setVideo(dataArray)
                    }
                })
            }
        })
    }

    function handleSubmitChange(){
        try {
            var query = firebase.database().ref("VideoList/").orderByChild("url").equalTo()
            query.once("child_added", function (snapshot) {

                snapshot.ref.update({
                    id: id,
                    category: category,
                    fileName: fileName
                })
                alert("Data Saved Successfully")
            })
        } catch (error) {
            console.error(error)
        }
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

}


export default withRouter(withStyles(styles)(Dashboard))