import React, { useState, useEffect } from 'react'
import { Paper, Button, Typography } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
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
    }
});

function UpdateProfile(props) {

    const { classes } = props


    const [url, setUrl] = useState('')
    const [category, setCategory] = useState('')
    const [id, setId] = useState('')
    const [fileName, setFileName] = useState('')
    

    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5" style={{ paddingBottom: '15px' }}>
                    Update User Profile
                </Typography>
                <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="url">Chinese Name</label>
                                <input className="form-control" id="url" disabled={true} value={props || ''} />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="englishName">English Name</label>
                                <input className="form-control" id="englishName" disabled={true} value={englishName || ''} />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="memberID">Member ID</label>
                                <input className="form-control" id="memberID" disabled={true} value={memberID || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label htmlFor="phonenumber">Phone Number</label>
                                <input className="form-control" id="phoneNumber" name="phoneNumber" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input className="form-control" id="email" name="email" disabled={true} value={email || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="joinDate">Member Join Date</label>
                                <input className="form-control" type="date" id="joinDate" value={memberJoinDate || ''} disabled={true} />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="birthdate">Birthday</label>
                                <input className="form-control" type="date" id="birthdate" value={birthdate || ''} disabled={true}/>
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="expiryDate">Expiry Date</label>
                                <input className="form-control" type="date" id="expiryDate" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label htmlFor="area">Area</label>
                                <select className="form-control" name="area" id="area" value={area} onChange={e => setArea(e.target.value)}>
                                    {areaArray.map(function (area, i) {
                                        return (
                                            <option key={i} value={area}>{area}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-3">
                            <div className="form-group">
                                <label htmlFor="district">District</label>
                                <select className="form-control" name="district" id="district" value={district} onChange={e => setDistrict(e.target.value)} >
                                    {districtArray.map(function (district, i) {
                                        return (
                                            <option key={i}>{district}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="form-group">
                                <label htmlFor="address">Address</label>
                                <input className="form-control" name="address" type="text" id="address" value={address} onChange={e => setAddress(e.target.value)} />
                            </div>
                        </div>
                    </div>

                </form>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={UpadateUserProfile}
                    className={classes.submit}>
                    Save Changes
          		</Button>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/MemberManagement"
                    className={classes.submit}>
                    Back to Management
          		</Button>
            </Paper>
        </main>
    )

    function UpadateUserProfile() {
        var memberID = props.match.params.memberID
        try {
            var query = firebase.db.ref("UserList/").orderByChild("memberID").equalTo(memberID)
            query.once("child_added", function (snapshot) {

                snapshot.ref.update({
                    expiryDate: expiryDate,
                    phoneNumber: phoneNumber,
                    area: area,
                    district: district,
                    address: address
                })
                alert("Data Saved Successfully")
            })
        } catch (error) {
            console.error(error)
        }
    }

    function fetchSpecificMemberDetail() {
        var memberID = props.match.params.memberID
        firebase.db.ref('UserList/').orderByChild('memberID').equalTo(memberID).on('value', function (snapshot) {
            snapshot.forEach(function (member) {
                setChineseName(member.val().chineseName)
                setEnglishName(member.val().englishName)
                setMemberID(member.val().memberID)
                setPhoneNumber(member.val().phoneNumber)
                setEmail(member.val().email)
                setAddress(member.val().address)
                setArea(member.val().area)
                setDistrict(member.val().district)
                setExpiryDate(member.val().expiryDate)
                setMemberJoinDate(member.val().memberJoinDate)
                setBirthdate(member.val().birthdate)
            })
        })
    }
}

export default withRouter(withStyles(styles)(UpdateProfile))