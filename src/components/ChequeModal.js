import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import PrintIcon from '@material-ui/icons/Print';
import SaveIcon from '@material-ui/icons/Save';
import { getCheque, editCheque, postDiscount } from '../services/chequeService';
import 'react-toastify/dist/ReactToastify.css';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(2),
            width: '60ch',
        },
        marginTop: "-20px",
    },
    modalListItemDiscount: {
        padding: "0px",
        paddingBottom: "0px",
        marginTop: "-10px",
        marginBottom: "-10px",
        fontSize: "0.5rem",
        lineHeight: "1"
    },
    modalListItem: {
        padding: "0px",
        fontSize: "0.5rem",
    }
}));

function ChequeModal(props) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const [orderId] = useState(props.selectedValue);
    const [discountValue, setDiscountValue] = useState("0");
    const [cheque, setCheque] = useState({});
    const [inputValue, setInputValue] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        async function fetchInitialProps() {
            const fetchCheque = await getServerCheque(orderId);
            setCheque(fetchCheque);
            setDiscountValue(fetchCheque.discount);
        }
        fetchInitialProps();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId]);

    const getServerCheque = async (id) => {
        try {
            const response = await getCheque(id);
            const fetchChequeInfo = response.data.body;
            return fetchChequeInfo ? fetchChequeInfo : [];
        } catch (ex) {
            console.log("sth went wrong");
        }
    };

    const handleItemInput = async (entryId, inputValue, chequeNo) => {
        try {
            await editCheque(entryId, inputValue);
            props.onClose();
            props.onSuccessEventToast(`Чек № ${chequeNo} был успешно изменён!`);
            props.onTriggerReload();
        } catch (ex) {
            props.onFailureEventToast(`Ну удалось изменить Чек № ${chequeNo}!`);
            if (ex.response && ex.response.status === 404) {
                console.log("Entered catch");
            }
        }
    }

    const validateInput = (inputValue, itemQuantity) => {
        if (inputValue <= itemQuantity) {
            setInputValue(inputValue);
        }
    }

    const handleDiscount = (e) => {
        setDiscountValue(e.target.value);
    }

    const handleServerDiscount = async () => {
        try {
            await postDiscount(cheque.id, discountValue);
            props.onClose();
            props.onSuccessEventToast(`Скидка для чека № ${cheque.number} успешно изменена!`);
            props.onTriggerReload();
        } catch (ex) {
            props.onFailureEventToast(`Не удалось применить скидку для чека № ${cheque.number}!`);
        }
    }

    const displayDate = () => {
        const dateFromSplit = today.split("-").reverse().join(".");
        return dateFromSplit;
    }

    const handleChequePrint = () => {
        console.log("Cheque Print");
        let content = `<style>
                            * {
                            font-size: 12px;
                            }
                            table{
                                width:220px;
                            }
                            .printTableHead td {
                                font-weight: bold;
                                font-size: smaller;
                                padding-top: 0px;
                                padding-bottom: 0px;
                            }
                            .itemTable {
                                border-top: 1px dotted #707070;
                                border-bottom: 1px dotted #707070;
                            }
                            .itemTable td {
                                // border-bottom: 1px solid #707070;
                                padding-left: 4px;
                            }
                        </style>`;

        content += `<span style="font-weight:bold;">Ресторан Саф</span><br/>`;
        content += `<span >Чек №${cheque.number} на дату ${displayDate()}</span><br/>`;
        content += `<span margin-bottom: 5px">Официант: ${cheque.by}</span><br/><br/>`;

        content += `<table class="itemTable" cellspacing="0">`;
        content += `<tr class="printTableHead">
                            <td>Наз.</td>
                            <td>Кол.</td>
                            <td>Цена</td>
                            <td>Сумма</td>
                        </tr>`;
        console.log(cheque.items);
        cheque.items.map(item => {
            console.log(item.meal);
            return content += `
                        <tr>
                            <td>${item.name + (item.variation_of > 0 ? "*" : "")}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price}</td>
                            <td>${item.quantity * item.price}</td>
                        </tr>
                    `;
        });

        let totalSum = cheque.items.reduce((acc, cVal) => acc + (cVal.price * 1) * (cVal.quantity * 1), 0);

        content += `
            <tr>
                <td colspan="3">Комиссионные 10%</td>
                <td>${(totalSum * 0.1).toFixed(2)}</td>
            </tr>`;


        content += `
            <tr>
                <td colspan="3">Итого</td>
                <td><strong>${(totalSum * 1.1).toFixed(2)}</strong></td>
            </tr>`;

        content += `</table>`;

        let pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    return (
        <Dialog onClose={props.onClose} open={props.open} >
            <DialogTitle>
                <Grid container direction="row" justify="space-between" spacing={1}>
                    <Grid item xs={12} sm={6} >
                        <Typography align="left" color="primary" variant="subtitle1">{cheque.by}</Typography>
                        <Typography align="left" color="secondary" variant="subtitle2">№: {cheque.number}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} edge="end">
                        <Typography align="right" color="primary">Сумма: {cheque.sum}</Typography>
                        <Typography align="right" color="primary"><PrintIcon fontSize="small" onClick={handleChequePrint} /></Typography>
                    </Grid>
                </Grid>
            </DialogTitle>
            <form className={classes.root} noValidate autoComplete="off">
                {props.role !== "takeout" ? <Paper elevation={2} variant="outlined">
                    <List>
                        <Grid container direction="row" justify="center" alignItems="center"
                            spacing={0}>
                            <React.Fragment>
                                <ListItem className={classes.modalListItemDiscount}>
                                    <Grid item xs={12} sm={10} >
                                        <ListItem>
                                            <FormControl component="fieldset">
                                                <RadioGroup row name="discount" value={discountValue} onChange={handleDiscount}>
                                                    <FormControlLabel value="0" control={<Radio size="small" />} label="Без скидки" />
                                                    <FormControlLabel value="50" control={<Radio size="small" />} label="50%" />
                                                    <FormControlLabel value="100" control={<Radio size="small" />} label="100%" />
                                                </RadioGroup>
                                            </FormControl>
                                        </ListItem>
                                    </Grid>
                                    <Grid item xs={3} sm={2}>
                                        <ListItem>
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" color="secondary" onClick={() => handleServerDiscount(discountValue)}>
                                                    <SaveIcon fontSize="small" />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    </Grid>
                                </ListItem>
                            </React.Fragment>
                        </Grid>
                    </List>
                </Paper> : null}
                <Paper elevation={2} variant="outlined">
                    <List>
                        <Grid container direction="row" justify="center" alignItems="center"
                            spacing={0}>
                            {!cheque.items ? (<p>Пустой Чек</p>) : null}
                            {cheque.items ? cheque.items.map((chequeItem, index, array) => (
                                <React.Fragment key={chequeItem.id}>
                                    <ListItem divider={index !== array.length - 1} className={classes.modalListItem}>
                                        <Grid item xs={12} sm={6} >
                                            <ListItem>
                                                <ListItemText primary={chequeItem.name} />
                                            </ListItem>
                                        </Grid>
                                        <Grid item xs={3} sm={1}>
                                            <TextField
                                                inputProps={{ min: 0, max: chequeItem.quantity, step: 1, style: { textAlign: 'center' } }}
                                                variant="standard"
                                                type="number"
                                                defaultValue={chequeItem.quantity}
                                                onChange={(e) => validateInput(e.target.value, chequeItem.quantity)}
                                            />
                                        </Grid>
                                        <Grid item xs={3} sm={1}>
                                            <ListItem>
                                                <ListItemText primary={"x" + chequeItem.price + "="} />
                                            </ListItem>
                                        </Grid>
                                        <Grid item xs={3} sm={2}>
                                            <ListItem>
                                                <ListItemText primary={(chequeItem.quantity * chequeItem.price).toFixed(1)} />
                                            </ListItem>
                                        </Grid>
                                        <Grid item xs={3} sm={2}>
                                            <ListItem>
                                                <ListItemSecondaryAction>
                                                    {cheque.status === "1" ?
                                                        <IconButton edge="end" color="secondary" onClick={() => handleItemInput(chequeItem.entry_id, inputValue, cheque.number)}>
                                                            <SaveIcon fontSize="small" />
                                                        </IconButton> : null
                                                    }
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        </Grid>
                                    </ListItem>
                                </React.Fragment>
                            )) : null}
                        </Grid>
                    </List>
                </Paper>
            </form>
            <iframe title="toPrint" id="ifmcontentstoprint" style={{ height: "0px", width: "0px", zIndex: "-1" }}></iframe>
        </Dialog>
    );
}

export default ChequeModal;

