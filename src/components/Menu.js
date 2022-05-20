import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';
import EditIcon from '@material-ui/icons/Edit';
import Title from './Title';
import MenuModal from './MenuModal';
import menuService from './../services/menuService';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
  spinner: {
    margin: "30px",
    display: 'flex',
    justifyContent: "center"
  }
}));

function Menu(props) {
  let [menuItems, setMenuItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState(null);
  const [reload, setReload] = useState(false);
  const classes = useStyles();
  let source = menuService.cancelToken.source();

  useEffect(() => {
    async function fetchInitialProps() {
      const serverMenu = await getServerMenu();
      setMenuItems(serverMenu);
    }
    fetchInitialProps();

    return () => { source.cancel("Menu Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function onInteraction() {
      const serverMenu = await getServerMenu();
      setMenuItems(serverMenu);
    }
    onInteraction();

    return () => { source.cancel("Menu Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  const getServerMenu = async () => {
    try {
      const response = await menuService.getMenu(source.token);
      const fetchBody = response.data.body;
      return fetchBody;
    } catch (ex) {
      console.log("Menu couldn't be retrieved");
    }
  };

  const handleMenuItem = (itemObj) => {
    setOpen(true);
    setSelectedMenuItem(itemObj);
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedMenuItem(null);
  };

  function createData(id, depName, menuName, itemName, itemPrice, depId, menuId) {
    const content = (
      <Button variant="outlined" color="primary" size="small" onClick={() => handleMenuItem({ id, depName, menuName, itemName, itemPrice, depId, menuId })}>
        <EditIcon fontSize="small" />
      </Button>);
    return { id, depName, menuName, itemName, itemPrice, content, depId, menuId };
  }

  let menuItemList = [];

  menuItems.forEach(item => {
    let menuItem = createData(item.item_id, item.dep_name, item.menu_name, item.item_name, item.item_price, item.dep_id, item.menu_id);
    menuItemList.push(menuItem);
  }
  );

  const handleNewItem = () => {
    setOpen(true);
    setSelectedMenuItem({ id: 0, depName: "", menuName: "", itemName: "", itemPrice: "", depId: "1", menuId: "1", menuItems: menuItems });
  }

  return (
    <React.Fragment>
      <ToastContainer position="bottom-right" />
      {selectedMenuItem ?
        <MenuModal
          selectedMenuItem={selectedMenuItem}
          onTriggerReload={() => setReload(!reload)}
          onSuccessEventToast={(msg) => toast.success(msg)}
          onFailureEventToast={(msg) => toast.error(msg)}
          open={open}
          onClose={handleClose} /> : null}
      <Grid container justify="center" alignItems="center" spacing={3}>
        <Grid item xs={12} sm={6}>
          <Grid container direction="row" alignItems="center" spacing={3}>
            <Grid item xs={12} sm={11}>
              <Title>Меню</Title>
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton color="primary" component="span" size="small" onClick={handleNewItem}>
                <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={10}>
          <TableContainer component={Paper}>
            {menuItems.length > 0 ?
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Кухня</TableCell>
                    <TableCell>Меню</TableCell>
                    <TableCell>Название</TableCell>
                    <TableCell>Цена</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {menuItemList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.depName}</TableCell>
                      <TableCell>{item.menuName}</TableCell>
                      <TableCell>{item.itemName}</TableCell>
                      <TableCell>{item.itemPrice}</TableCell>
                      <TableCell align="right">{item.content}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              : <div className={classes.spinner}><CircularProgress size={50} /></div>}
          </TableContainer>
        </Grid>
        <div className={classes.seeMore}>
          <Link color="primary" href="#" onClick={(e) => { e.preventDefault() }}>
            {""}
          </Link>
        </div>
      </Grid>
    </React.Fragment>
  );
}

export default Menu;
