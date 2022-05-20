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
        justifyContent: "center"
    }
}));

function StaffList({ staff }) {
    const classes = useStyles();
    return staff.length > 0 ? (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>№</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Логин</TableCell>
                    <TableCell>Роль</TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {staff.map((st, index) => (
                    <TableRow key={index}>
                        <TableCell>{st.id}</TableCell>
                        <TableCell>{st.fullname}</TableCell>
                        <TableCell>{st.username}</TableCell>
                        <TableCell>{st.role}</TableCell>
                        <TableCell align="right">{st.content}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    ) : (<div className={classes.spinner}><CircularProgress size={50} /></div>)
}

export default StaffList;