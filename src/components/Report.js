import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import PrintIcon from '@material-ui/icons/Print';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import reportService from './../services/reportService';
import auth from "./../services/authService";

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
    spinner: {
        margin: "30px",
        display: 'flex',
        justifyContent: "center"
    },
    table: {
        border: "1px solid #e0e0e0"
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 135,
    },
    tableHead: {
        fontWeight: "bold",
        fontSize: "smaller",
        paddingTop: "0px",
        paddingBottom: "0px"
    }
}));

function Report(props) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    const [user, setUser] = useState("nullUser");
    let [kitchenItems, setKitchenItems] = useState([]);
    const [daily, setDaily] = useState(true);
    const [dailyCheckBox, setDailyCheckBox] = useState(true);
    const [showReport, setShowReport] = useState(false);
    const [dateFrom, setDateFrom] = useState(today);
    const [dateTo, setDateTo] = useState(today);
    const [totalSum, setTotalSum] = useState(0.0);
    const [totalSumDiscount, setTotalSumDiscount] = useState(0.0);
    const classes = useStyles();
    let source = reportService.cancelToken.source();

    useEffect(() => {
        const attempt = auth.getCurrentUser();
        setUser(attempt);

        async function fetchInitialProps() {
            const serverItems = await getServerReport();
            setKitchenItems(serverItems);
        }
        fetchInitialProps();

        return () => { source.cancel("Report Component got unmounted"); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        async function todayReportToggler() {
            const serverItems = await getServerReport();
            setKitchenItems(serverItems);
        }
        todayReportToggler();

        return () => { source.cancel("Report Component got unmounted"); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dailyCheckBox]);

    useEffect(() => {
        setKitchenItems([]);
        async function fetchInitialProps() {
            const serverItems = await getServerReport();
            setKitchenItems(serverItems);
        }
        fetchInitialProps();

        return () => { source.cancel("Report Component got unmounted"); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showReport]);

    useEffect(() => {
        calculateTotalSum();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [kitchenItems]);

    const getServerReport = async () => {
        try {
            const response = await reportService.getReport(daily, dateFrom, dateTo, source.token);
            const fetchBody = response.data.body;
            return fetchBody;
        } catch (ex) {
            console.log(ex);
            console.log("Report couldn't be retrieved");
            return [];
        }
    };

    function calculateTotalSum() {
        let tempSum = 0.0;
        let tempSumDiscount = 0.0;

        kitchenItems.forEach(item => {
            item.items.forEach(food => {
                tempSum += food.sum * 1.0;
                tempSumDiscount += food.discount_sum * 1.0;
            });
        });

        setTotalSum(tempSum);
        setTotalSumDiscount(tempSumDiscount);
    }

    const dateFromForPrint = () => {
        const dateFromSplit = dateFrom.split("-").reverse().join(".");
        return dateFromSplit;
    }
    const dateToForPrint = () => {
        const dateToSplit = dateTo.split("-").reverse().join(".");
        return dateToSplit;
    }

    const handleDailyReportCheckBox = (e) => {
        if (e.target.checked) {
            setDaily(true);
            setDailyCheckBox(!dailyCheckBox);
        } else {
            setDaily(false);
        }
    }

    dateFromForPrint();

    const handlePrint = () => {

        let content = `<style>
                            table{
                                width:100%;
                            }
                            .printTableHead td {
                                font-weight: bold;
                                font-size: smaller;
                                padding-top: 0px;
                                padding-bottom: 0px;
                            }
                            .itemTable {
                                border: 1px solid #707070;
                            }
                            .itemTable td {
                                border-bottom: 1px solid #707070;
                                padding-left: 4px;
                            }
                        </style>`;

        content += `<span style="padding:8px 0px 8px 0px; font-size: 18px; font-weight:bold;">Ресторан Саф</span><br/>`;
        content += `<span style="float:left; margin-bottom:8px; margin-top:8px;">Отчёт ${daily ? ('за ' + dateToForPrint()) : ('с ' + dateFromForPrint() + ' по ' + dateToForPrint())}</span>`;
        content += `<span style="float:right; margin-bottom:8px; margin-top:8px;">${user}</span>`;

        content += `<table style="border-bottom: 0; border: 1px solid #707070;">
                            <tr>
                                <td>Итого продаж на сумму</td>
                                <td style="font-weight:bold; text-align:right;">${totalSum - totalSumDiscount}${totalSumDiscount > 0 ? ' (' + totalSum + '-' + totalSumDiscount + ')' : ''} сомони</td>
                            </tr>
                    </table><br/>`;

        content += `<table class="itemTable" cellspacing="0">`;
        content += `<tr class="printTableHead">
                            <td>Название</td>
                            <td>Количество</td>
                            <td>Цена</td>
                            <td>Сумма</td>
                        </tr>`;

        kitchenItems.forEach(item => {
            content += `<tr><td colspan="4" style="padding:8px 0px 8px 8px; font-weight:bold;">${item.name}</td></tr>`;

            item.items.forEach(food => {
                content += `
                        <tr>
                            <td>${(food.variationOf > 0 ? "*" : "") + food.meal}</td>
                            <td>${food.count}</td>
                            <td>${food.price}</td>
                            <td>${food.sum}${food.discount_sum > 0 ? ' (-' + food.discount_sum + ')' : ''}</td>
                        </tr>
                    `;
            });

        });

        content += `</table>`;

        let pri = document.getElementById("ifmcontentstoprint").contentWindow;
        pri.document.open();
        pri.document.write(content);
        pri.document.close();
        pri.focus();
        pri.print();
    }

    return (
        <React.Fragment>
            <Grid container justify="center" alignItems="center" spacing={2}>
                <Grid item xs={12} md={10}>
                    <Grid container direction="row" justify="space-between" alignItems="center" spacing={1}>
                        <Grid item xs={12} md={10}>
                            <Grid container direction="row" alignItems="center" spacing={1}>
                                <Grid item xs={12} md={3}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                defaultChecked="true"
                                                onChange={handleDailyReportCheckBox}
                                                name="daily"
                                                color="primary"
                                            />
                                        }
                                        label="Сегодня"
                                    />
                                </Grid>
                                {daily ? null : <React.Fragment><Grid item xs={12} md={3}>
                                    <TextField
                                        id="date"
                                        type="date"
                                        value={dateFrom}
                                        className={classes.textField}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </Grid>
                                    <Grid item xs={12} md={3}>
                                        <TextField
                                            id="date"
                                            type="date"
                                            value={dateTo}
                                            className={classes.textField}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            onChange={(e) => setDateTo(e.target.value)}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3}>
                                        <Button variant="contained" color="primary" size="small" onClick={() => setShowReport(!showReport)}>
                                            Показать
                                    </Button>
                                    </Grid>
                                </React.Fragment>
                                }
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Grid container justify="flex-end">
                                {kitchenItems.length > 0 ? <IconButton onClick={handlePrint}>
                                    <PrintIcon variant="contained" color="primary" />
                                </IconButton> : <IconButton onClick={handlePrint} disabled>
                                    <PrintIcon variant="contained" color="primary" />
                                </IconButton>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={10}>
                    {kitchenItems.length > 0 ?
                        <React.Fragment>
                            <Table size="small" className={classes.table} component="table">
                                <TableBody>
                                    <TableRow>
                                        <TableCell style={{ padding: "5px", fontWeight: "bold" }} > Итого продаж на сумму</TableCell>
                                        <TableCell align="right"><span style={{ padding: "5px", fontWeight: "bold" }}>{totalSum - totalSumDiscount}{totalSumDiscount > 0 ? ' (' + totalSum + '-' + totalSumDiscount + ')' : ''}</span></TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <br />

                            <Table size="small" className={classes.table} component="table">
                                <TableBody>
                                    {kitchenItems.map((item) => (
                                        <React.Fragment key={item.id}>
                                            <TableRow>
                                                <TableCell colSpan="4"><span style={{ padding: "5px", display: "inline-block", fontWeight: "bold" }}>{item.name}</span></TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className={classes.tableHead}>Название</TableCell>
                                                <TableCell className={classes.tableHead}>Количество</TableCell>
                                                <TableCell className={classes.tableHead}>Цена</TableCell>
                                                <TableCell className={classes.tableHead}>Сумма</TableCell>
                                            </TableRow>
                                            {item.items.map((item) => (
                                                <TableRow key={item.id + item.price}>
                                                    <TableCell>{(item.variationOf > 0 ? "*" : "") + item.meal}</TableCell>
                                                    <TableCell>{item.count}</TableCell>
                                                    <TableCell>{item.price}</TableCell>
                                                    <TableCell>{item.sum}{item.discount_sum > 0 ? ' (-' + item.discount_sum + ')' : ''}</TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </React.Fragment>
                        : <div className={classes.spinner}><CircularProgress size={50} /></div>}
                </Grid>
                <div className={classes.seeMore}>
                    <Link color="primary" href="#" onClick={(e) => { e.preventDefault() }}>
                        {""}
                    </Link>
                </div>
                <iframe title="toPrint" id="ifmcontentstoprint" style={{ height: "0px", width: "0px", zIndex: "-1" }}></iframe>
            </Grid>
        </React.Fragment>
    );
}

export default Report;
