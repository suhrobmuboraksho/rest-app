import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import waiterService from "../services/waiterService";
import Typography from '@material-ui/core/Typography';
import ActiveWaiters from "./ActiveWaiters";
import Title from "./Title";
import 'react-toastify/dist/ReactToastify.css';

function preventDefault(event) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function Waiters(props) {
  const [waiters, setWaiters] = useState([]);
  const [serverSyncToggler, setServerSyncToggler] = useState(false);
  const classes = useStyles();
  let source = waiterService.cancelToken.source();

  useEffect(() => {
    async function fetchInitialProps() {
      const tempWaiters = await getServerWaiters();
      setWaiters(tempWaiters);
    }
    fetchInitialProps();

    return () => { source.cancel("Waiter Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function onInteraction() {
      const tempWaiters = await getServerWaiters();
      setWaiters(tempWaiters);
    }
    onInteraction();

    return () => { source.cancel("Waiter Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverSyncToggler]);

  const getServerWaiters = async () => {
    try {
      const response = await waiterService.getWaiters(source.token);
      const fetchWaiters = response.data.body;
      return fetchWaiters;
    } catch (ex) {
      console.log("Waiters couldn't be retrieved");
    }
  };

  const handleCashReceival = async (waiter, openOrder, fullname) => {
    if (openOrder == 0) {
      try {
        await waiterService.receiveCashFromWaiter(waiter);
        setServerSyncToggler(!serverSyncToggler);
        toast.success(`Деньги от ${fullname} успешно приняты!`);
      } catch (ex) {
        toast.error(`Ошибка в получении денег от ${fullname}!`);
        if (ex.response && ex.response.status === 404) {
          console.log("Entered catch");
        }
      }
    }
    else {
      toast.error(`Официант ${fullname} имеет открытый заказ`);
    }
  }

  function createData(id, fullname, cash, cash_submitted, openOrders) {
    const content = cash > 0 ? (
      <Button variant="contained" color="secondary" size="small" onClick={() => handleCashReceival(id, openOrders, fullname)}>
        Принять
      </Button>
    ) : null;
    return { id, fullname, cash, cash_submitted, content };
  }

  let waiterArray = [];

  waiters.forEach(waiter => {
    let waiterItem = createData(waiter.id, waiter.fullname, waiter.cash, waiter.cash_submitted, waiter.has_open_orders);
    waiterArray.push(waiterItem);
  });

  const acceptedCash = () => {
    const cashReceived = waiters.reduce((acc, cVal) => acc + cVal.cash_submitted * 1, 0);
    return cashReceived;
  }

  const remainderCash = () => {
    const cashRemained = waiters.reduce((acc, cVal) => acc + cVal.cash * 1, 0);
    return cashRemained;
  }

  const overallIncome = () => {
    const cashRemained = waiters.reduce((acc, cVal) => acc + cVal.cash * 1, 0);
    const cashAccepted = waiters.reduce((acc, cVal) => acc + cVal.cash_submitted * 1, 0)
    let overallCash = cashRemained + cashAccepted;
    return overallCash;
  }

  return (
    <React.Fragment>
      <ToastContainer position="bottom-right" />
      <Grid container justify="center" alignItems="center" spacing={3}>
        <Grid item xs={12} sm={6}>
          <Grid container justify="flex-start" alignItems="flex-start" direction="row" spacing={3}>
            <Grid item xs={6} sm={6}>
              <Title>Реализация</Title>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={10}>
          <TableContainer component={Paper}>
            <ActiveWaiters waiters={waiterArray} />
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={10}>
          <Grid container direction="row" justify="center" alignItems="center" spacing={1}>
            <Grid item xs={12} sm={4}>
              <Paper>
                <Typography variant="h6" display="block" align="center">{overallIncome()}</Typography>
                <Typography variant="h6" display="block" align="center">Доход</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper>
                <Typography variant="h6" display="block" align="center">{remainderCash()}</Typography>
                <Typography variant="h6" display="block" align="center">Осталось</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper>
                <Typography variant="h6" display="block" align="center">{acceptedCash()}</Typography>
                <Typography variant="h6" display="block" align="center">Принято</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>{""}</Link>
      </div>
    </React.Fragment>
  );
}
