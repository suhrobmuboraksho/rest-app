import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NavBar from './components/NavBar';
import Orders from './components/Orders';
import Waiters from './components/Waiters';
import Sections from './components/Sections';
import Copyright from './components/Copyright';
import Login from './components/Login';
import Logout from './components/Logout';
import Menu from './components/Menu';
import Staff from './components/Staff';
import Report from './components/Report';
import Backup from './components/Backup';
import auth from "./services/authService";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
    alignItems: 'center'
  }
}));

function App() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState("nullUser");
  const [role, setRole] = useState("nullRole");
  const classes = useStyles();

  useEffect(() => {
    const userName = auth.getCurrentUser();
    const userRole = auth.getCurrentUserRole();
    setUser(userName);
    setRole(userRole);
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Ресторан Саф
          </Typography>
          <Typography component="h4" variant="h6" color="inherit" noWrap className={classes.title} align="right">
            {user}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}>
        <div className={classes.toolbarIcon}>
          <IconButton onClick={() => setOpen(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <NavBar user={user} role={role} />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container alignItems="center" spacing={3}>
            <Grid item xs={12}>
              <Paper className={classes.paper} elevation={4}>
                <Switch>
                  <Route path="/orders" render={(props) => {
                    if (user === null || role === null) {
                      return <Redirect to="/login" />
                    } else if (user === "nullUser" || role === "nullRole") { }
                    else {
                      return (<Orders {...props} role={role} />)
                    }
                  }} />
                  <Route path="/waiters" render={(props) => {
                    if (user === null || role === null) {
                      return <Redirect to="/login" />
                    } else if (user === "nullUser" || role === "nullRole") { }
                    else {
                      return (<Waiters {...props} />)
                    }
                  }} />
                  <Route path="/sections" render={(props) => {
                    if (user === null || role === null) {
                      return <Redirect to="/login" />
                    } else if (user === "nullUser" || role === "nullRole") { }
                    else {
                      return (<Sections {...props} />)
                    }
                  }} />
                  <Route path="/menu" render={(props) => {
                    if (user === null || role === null) {
                      return <Redirect to="/login" />
                    } else if (user === "nullUser" || role === "nullRole") { }
                    else {
                      return (<Menu {...props} />)
                    }
                  }} />
                  <Route path="/staff" render={(props) => {
                    if (user === null || role === null) {
                      return <Redirect to="/login" />
                    } else if (user === "nullUser" || role === "nullRole") { }
                    else {
                      return (<Staff {...props} />)
                    }
                  }} />
                  <Route path="/report" render={(props) => {
                    if (user === null || role === null) {
                      return <Redirect to="/login" />
                    } else if (user === "nullUser" || role === "nullRole") { }
                    else {
                      return (<Report {...props} />)
                    }
                  }} />
                  <Route path="/backup" render={(props) => {
                    if (user === null || role === null) {
                      return <Redirect to="/login" />
                    } else if (user === "nullUser" || role === "nullRole") { }
                    else {
                      return (<Backup {...props} />)
                    }
                  }} />
                  <Route path="/login" component={Login} />
                  <Route path="/logout" component={Logout} />
                  <Redirect from="/" exact to="/orders" />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
}

export default App;
