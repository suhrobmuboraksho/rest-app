import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import ordersService from '../services/ordersService';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import EditIcon from '@material-ui/icons/Edit';
import Title from './Title';
import ChequeModal from './ChequeModal';


const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  spinner: {
    margin: "30px",
    display: 'flex',
    justifyContent: "center"
  },
  tableMargin: {
    marginTop: "20px"
  }
}));

function Orders(props) {
  let [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("active");
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [reload, setReload] = useState(false);
  const classes = useStyles();
  let source = ordersService.cancelToken.source();

  useEffect(() => {
    async function fetchInitialProps() {
      const tempOrders = await getServerOrders();
      setOrders(tempOrders);
    }
    fetchInitialProps();

    return () => { source.cancel("Order Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function onComponentUpdate() {
      const tempOrders = await getServerOrders();
      setOrders(tempOrders);
    }
    onComponentUpdate();

    return () => { source.cancel("Order Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    async function onComponentUpdate() {
      const tempOrders = await getServerOrders();
      setOrders(tempOrders);
    }
    onComponentUpdate();

    return () => { source.cancel("Order Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const getServerOrders = async () => {
    try {
      setIsButtonDisabled(false);
      const response = await ordersService.getOrders(filter, source.token);
      const fetchOrders = response.data.body;
      setIsButtonDisabled(true);
      return fetchOrders;
    } catch (ex) {
      console.log("Orders weren't retrieved");
    }
  };

  const handleCheque = (id) => {
    setOpen(true);
    setSelectedValue(id);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedValue(null);
  };

  function createData(id, number, opentime, by, sum, sum_total, status, discount) {
    const content = (
      <Button variant="outlined" color="primary" size="small" onClick={() => handleCheque(id)}>
        <EditIcon fontSize="small" />
      </Button>);
    return { id, number, opentime, by, sum, sum_total, status, discount, content };
  }

  let orderArray = [];

  orders.forEach(or => {
    let orderItem = createData(or.id, or.number, or.opentime, or.by, or.sum, or.sum_total, or.status, or.discount);
    orderArray.push(orderItem);
  });

  return (
    <React.Fragment>
      <ToastContainer position="bottom-right" />
      {selectedValue ?
        <ChequeModal
          role={props.role}
          selectedValue={selectedValue}
          onTriggerReload={() => setReload(!reload)}
          onSuccessEventToast={(msg) => toast.success(msg)}
          onFailureEventToast={(msg) => toast.error(msg)}
          open={open}
          onClose={handleClose} /> : null}
      <Grid container direction="row" alignItems="center" spacing={2}>
        <Grid item xs={12} sm={9}>
          <Title>Заказы</Title>
        </Grid>
        <Grid item xs={12} sm={3}>
          {
            isButtonDisabled ? <ButtonGroup color="primary">
              <Button variant={filter === "active" ? "contained" : "outlined"} onClick={() => setFilter("active")}>Открытые</Button>
              <Button variant={filter === "closed" ? "contained" : "outlined"} onClick={() => setFilter("closed")}>Закрытые</Button>
            </ButtonGroup> :
              <ButtonGroup color="primary">
                <Button disabled>Открытые</Button>
                <Button disabled>Закрытые</Button>
              </ButtonGroup>
          }
        </Grid>
      </Grid>
      {isButtonDisabled ? <TableContainer component={Paper} className={classes.tableMargin}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>№ Чека</TableCell>
              <TableCell>Время</TableCell>
              <TableCell>Официант</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell> + %</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderArray.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.number}</TableCell>
                <TableCell>{order.opentime}</TableCell>
                <TableCell>{order.by}</TableCell>
                <TableCell>{order.sum ? order.sum : 0}</TableCell>
                <TableCell>{order.sum_total ? order.sum_total : 0}</TableCell>
                <TableCell>{order.discount > 0 ? (order.discount + "%") : ""}</TableCell>
                <TableCell align="right">{order.content}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> : <div className={classes.spinner}><CircularProgress size={50} /></div>}
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={(e) => { e.preventDefault() }}>
          {""}
        </Link>
      </div>
    </React.Fragment>
  );
}

export default Orders;
