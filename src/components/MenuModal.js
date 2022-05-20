import React, { useRef, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Button from '@material-ui/core/Button';
import menuService from './../services/menuService';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(2),
            width: '60ch',
        },
    },
    buttonMargin: {
        margin: "16px",
        marginTop: "2px",
        padding: "6px"
    }
}));

function OrderModal(props) {
    const [menuItem] = useState(props.selectedMenuItem);
    const [depId, setDepId] = useState(menuItem.depId);
    const [menuId, setMenuId] = useState(menuItem.menuId);
    const [itemName, setItemName] = useState(menuItem.itemName);
    const [itemPrice, setItemPrice] = useState(menuItem.itemPrice);
    const [allItems] = useState(menuItem.menuItems);
    const [varof, setVarof] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const previousNameRef = useRef();
    const previousPriceRef = useRef();
    previousNameRef.current = props.selectedMenuItem.itemName;
    previousPriceRef.current = props.selectedMenuItem.itemPrice;
    const prevName = previousNameRef.current;
    const prevPrice = previousPriceRef.current;
    const classes = useStyles();

    console.log(menuId);

    const departments = [
        {
            value: '1',
            label: 'Ошхона 1 - Табака',
        },
        {
            value: '2',
            label: 'Ошхона 2 - Кофевар',
        },
        {
            value: '3',
            label: 'Ошхона 3 - Чой',
        },
        {
            value: '4',
            label: 'Ошхона 4 - Ош',
        },
        {
            value: '5',
            label: 'Ошхона 5 - Супити',
        },
        {
            value: '6',
            label: 'Ошхона 6 - Манту',
        },
        {
            value: '7',
            label: 'Ошхона 7 - Магазин',
        },
        {
            value: '8',
            label: 'Ошхона 8 - Самбуса',
        },
    ];
    // const menuCatsOld = [
    //     {
    //         value: '1',
    //         label: 'Таоми 1',
    //     },
    //     {
    //         value: '2',
    //         label: 'Таоми 2',
    //     },
    //     {
    //         value: '3',
    //         label: 'Шашликҳо',
    //     },
    //     {
    //         value: '4',
    //         label: 'Иловагиҳо',
    //     },
    //     {
    //         value: '5',
    //         label: 'Наҳорӣ',
    //     },
    //     {
    //         value: '6',
    //         label: 'Нӯшокиҳо',
    //     },
    //     {
    //         value: '7',
    //         label: 'Шарбатҳо',
    //     },
    //     {
    //         value: '8',
    //         label: 'Қаҳваҳо',
    //     },
    // ];
    const menuCats = [
        {
            value: '1',
            label: 'Табака',
        },
        {
            value: '2',
            label: 'Самбуса',
        },
        {
            value: '3',
            label: 'Кафе',
        },
        {
            value: '4',
            label: 'Кух. Калон',
        },
        {
            value: '5',
            label: 'Кух. Майда',
        },
        {
            value: '6',
            label: 'Чойхона',
        },
        {
            value: '7',
            label: 'Манту',
        },
        {
            value: '8',
            label: 'Магазин',
        },
    ];

    const handleItemInput = async (e) => {
        setDisabled(!disabled);
        try {
            await menuService.editMenu(menuItem.id, itemName, itemPrice, depId, menuId);
            props.onClose();
            props.onTriggerReload();
            if (prevName != itemName) {
                props.onSuccessEventToast(`${prevName} успешно изменено на ${itemName}.`);
            } else if (prevPrice != itemPrice) {
                props.onSuccessEventToast(`Цена для ${itemName} успешно изменена с ${prevPrice} на ${itemPrice}.`);
            }
        } catch (ex) {
            props.onFailureEventToast(`Не удалось изменить ${itemName}.`);
            if (ex.response && ex.response.status === 404) {
                console.log("Entered catch");
            }
        }
    }

    const handleNewItem = async (e) => {
        setDisabled(!disabled);
        try {
            await menuService.addMenu(itemName, itemPrice, depId, menuId, varof);
            props.onClose();
            props.onTriggerReload();
            props.onSuccessEventToast(`${itemName} добавлен в список Меню.`);
        } catch (ex) {
            if (ex.response && ex.response.status === 404)
                console.log("New Item not found.");
        }
    }

    const handleItemDelete = async (e) => {
        setDisabled(!disabled);
        try {
            await menuService.deleteMenuItem(menuItem.id);
            props.onClose();
            props.onTriggerReload();
            props.onSuccessEventToast(`${itemName} удалён из списка Меню.`);
        } catch (ex) {
            props.onFailureEventToast(`${itemName} не был удалён из списка Меню.`);
            if (ex.response && ex.response.status === 404)
                console.log("Delete method was not completed successfully.");
        }
    }

    return (
        <Dialog onClose={props.onClose} open={props.open} >
            <form className={classes.root} noValidate autoComplete="off">
                <Paper elevation={2} variant="outlined">
                    <List>
                        <Grid container direction="row" justify="center" alignItems="center"
                            spacing={0}>
                            <Grid item xs={12} sm={6} >
                                <ListItem>
                                    <ListItemText primary="Кухня" />
                                </ListItem>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    margin="dense"
                                    select
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={depId}
                                    onChange={(e) => setDepId(e.target.value)}
                                >
                                    {departments.map(department => (
                                        <option key={department.value} value={department.value}>
                                            {department.label}
                                        </option>))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <ListItem>
                                    <ListItemText primary="Меню" />
                                </ListItem>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    margin="dense"
                                    select
                                    SelectProps={{
                                        native: true,
                                    }}
                                    value={menuId}
                                    onChange={(e) => setMenuId(e.target.value)}
                                >
                                    {menuCats.map(menu => (
                                        <option key={menu.value} value={menu.value}>
                                            {menu.label}
                                        </option>))}
                                </TextField>
                            </Grid>
                            {menuItem.id === 0 ?
                                <React.Fragment>
                                    <Grid item xs={12} sm={6} >
                                        <ListItem>
                                            <ListItemText primary="Вариант" />
                                        </ListItem>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            required
                                            margin="dense"
                                            select
                                            SelectProps={{
                                                native: true,
                                            }}
                                            value={varof}
                                            onChange={(e) => setVarof(e.target.value)}
                                        >
                                            <option value="0">
                                                Не является вариантом
                                            </option>
                                            {allItems.map(menu => (
                                                menu.item_varof == 0 ? <option key={menu.item_id} value={menu.item_id}>
                                                    {menu.item_name}
                                                </option> : null))}
                                        </TextField>
                                    </Grid>
                                </React.Fragment> : null}
                            <Grid item xs={12} sm={6} >
                                <ListItem>
                                    <ListItemText primary="Название" />
                                </ListItem>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    variant="standard"
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} >
                                <ListItem>
                                    <ListItemText primary="Цена" />
                                </ListItem>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    inputProps={{ style: { textAlign: 'center' } }}
                                    variant="standard"
                                    type="number"
                                    value={itemPrice}
                                    onChange={(e) => setItemPrice(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </List>
                </Paper>
            </form>
            <Button variant="contained" color="primary" size="small" onClick={menuItem.id !== 0 ? handleItemInput : handleNewItem} disabled={disabled} className={classes.buttonMargin}>
                Сохранить
            </Button>
            {menuItem.id !== 0 ? <Button variant="contained" color="secondary" size="small" onClick={handleItemDelete} disabled={disabled} className={classes.buttonMargin}>
                Удалить
            </Button> : null}
        </Dialog>
    );
}

export default OrderModal;

