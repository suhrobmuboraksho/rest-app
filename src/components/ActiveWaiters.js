import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    spinner: {
        margin: "30px",
        display: 'flex',
        justifyContent: 'center'
    }
}));

function ActiveWaiters({ waiters }) {
    const classes = useStyles();
    return waiters.length > 0 ? (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Официант</TableCell>
                    <TableCell>Сумма</TableCell>
                    <TableCell>Принято</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {waiters.map((waiter, index) => (
                    <TableRow key={index}>
                        <TableCell>{waiter.fullname}</TableCell>
                        <TableCell>{waiter.cash}</TableCell>
                        <TableCell>{waiter.cash_submitted}</TableCell>
                        <TableCell align="right">{waiter.content}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ) : (<div className={classes.spinner}><CircularProgress size={50} /></div>)
}

export default ActiveWaiters;