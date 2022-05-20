import React, { useState, useEffect } from 'react';
import auth from "../services/authService";
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(1),
        padding: theme.spacing(4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function Login(props) {
    const classes = useStyles();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        auth.logout();
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await auth.login(username, password);
            window.location = "/";
        } catch (ex) {
            if (ex.response && (ex.response.status === 404 || ex.response.status === 401)) {
                errors.username = ex.response.data.message;
                setErrors({ errors });
            }
        }
        console.log("Submit handled");
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Вход в систему
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        value={username}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Логин"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <TextField
                        value={password}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Пароль"
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        style={{ paddingTop: "15px", paddingBottom: "15px" }}
                    >
                        Авторизация
                    </Button>

                </form>
            </div>
        </Container>
    );
}