import React, { useState } from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel, FormGroup, FormControlLabel, Select, Checkbox,  MenuItem } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import InputAdornment from '@material-ui/core/InputAdornment'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../../firebase'
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
	avatar: {
		margin: theme.spacing.unit,
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing.unit,
	},
	formControl: {
		margin: theme.spacing.unit,
	},

	submit: {
		marginTop: theme.spacing.unit * 3,
	},

})

function Register(props) {
	const { classes } = props

	const [nickName, setNickName] = useState('')
	const [englishName, setEnglishName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [phonenumber, setPhoneNumber] = useState('')
	
	
	const [agreement, setAgreement] = useState({
		agreement: false,
	})

	

	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<Avatar className={classes.avatar}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Register Account
       			</Typography>
				<form className={classes.form} onSubmit={e => e.preventDefault() && false}>
					<div className="row">
						<div className="col-sm-6">
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="nickName">Nick Name</InputLabel>
								<Input id="nickName" name="name" autoComplete="off" autoFocus value={nickName} onChange={e => setNickName(e.target.value)} />
							</FormControl>
						</div>
						<div className="col-sm-6">
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="englishName">English Name</InputLabel>
								<Input id="englishName" name="name" autoComplete="off" autoFocus value={englishName} onChange={e => setEnglishName(e.target.value)} />
							</FormControl>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-6">
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="phonenumber">Phone Number</InputLabel>
								<Input id="phonenumber" name="phonenumber" autoComplete="off" value={phonenumber} onChange={e => setPhoneNumber(e.target.value)}
									startAdornment={<InputAdornment position="start">+852</InputAdornment>} />
							</FormControl>
						</div>
						<div className="col-sm-6">
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="email">Email Address</InputLabel>
								<Input id="email" name="email" autoComplete="off" value={email} onChange={e => setEmail(e.target.value)} />
							</FormControl>
						</div>
					</div>
					<div className="row">
						<div className="col-sm-6">
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="password">Password</InputLabel>
								<Input name="password" type="password" id="confirmpassword" autoComplete="off" value={password} onChange={e => setPassword(e.target.value)} />
							</FormControl>
						</div>
						<div className="col-sm-6">
							<FormControl margin="normal" required fullWidth>
								<InputLabel htmlFor="confirmpassword">Confirm Password</InputLabel>
								<Input name="confirmpassword" type="password" id="confirmpassword" autoComplete="off" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onBlur={onVerifyPassword} />
							</FormControl>
						</div>
					</div>

					<FormControl component="filedset" className={classes.formControl}>
						<FormGroup>
							<FormControlLabel
								control={
									<Checkbox checked={agreement.agreement} onChange={() => setAgreement({ agreement: !agreement.agreement })} name="terms" required={true} />}
								label="By signing up, you agree with our terms & privacy policy."
							/>
						</FormGroup>
					</FormControl>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						onClick={onRegister}
						className={classes.submit}>
						Register
          			</Button>

					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="secondary"
						component={Link}
						to="/login"
						className={classes.submit}>
						Cancel Registration
          			</Button>
				</form>
			</Paper>
		</main>
	)

	

	async function onVerifyPassword() {
		if (password !== "" && confirmPassword !== "") {
			if (password !== confirmPassword) {
				console.log("Password does not match")
				alert("Your Paswword does not match!")
				return
			} 
		}
	}

	async function onRegister() {
		if (agreement.agreement === true) {
			try {

				await firebase.register(nickName, email, phonenumber, password)
				await firebase.addData(nickName, englishName, email, phonenumber)
				props.history.replace('/dashboard')
			} catch (error) {
				alert(error.message)
			}
		}
	}
}

export default withRouter(withStyles(styles)(Register))