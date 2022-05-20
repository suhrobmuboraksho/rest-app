import React, { useState, useEffect } from 'react';
import Link from '@material-ui/core/Link';
import { ToastContainer, toast } from "react-toastify";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TableContainer from '@material-ui/core/TableContainer';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import EditIcon from '@material-ui/icons/Edit';
import Title from './Title';
import StaffModal from './StaffModal';
import StaffList from "./StaffList";
import userService from "../services/userService";
import 'react-toastify/dist/ReactToastify.css';

function preventDefault(event) {
    event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
    seeMore: {
        marginTop: theme.spacing(3),
    },
}));

export default function Staff(props) {
    const [staff, setStaff] = useState([]);
    const [staffItem, setStaffItem] = useState(null);
    const [reload, setReload] = useState(true);
    const [open, setOpen] = useState(false);
    let source = userService.cancelToken.source();
    const classes = useStyles();

    useEffect(() => {
        async function fetchInitialProps() {
            const tempStaff = await getServerStaff();
            setStaff(tempStaff);
        }
        fetchInitialProps();
        return () => { source.cancel("Staff Component got unmounted"); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        async function onInteraction() {
            const tempStaff = await getServerStaff();
            setStaff(tempStaff);
        }
        onInteraction();
        return () => { source.cancel("Staff Component got unmounted"); }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload]);

    const getServerStaff = async () => {
        try {
            const response = await userService.getStaff(source.token);
            const fetchStaff = response.data.body;
            return fetchStaff;
        } catch (ex) {
            console.log("Waiters couldn't be retrieved");
        }
    };

    const handleStaffItem = (staffItemObj) => {
        setOpen(!open);
        setStaffItem(staffItemObj);
    }

    const handleNewStaff = () => {
        setStaffItem({ id: "0", fullname: "", username: "", role: "4", roleId: "4" });
        setOpen(!open);
    }

    function createData(id, fullname, username, role, roleId) {
        const content = (
            <Button variant="outlined" color="primary" size="small" onClick={() => handleStaffItem({ id, fullname, username, role, roleId })}>
                <EditIcon fontSize="small" />
            </Button>
        );
        return { id, fullname, username, role, roleId, content };
    }

    let staffArray = [];

    staff.forEach(staff => {
        let staffItemIterator = createData(staff.id, staff.fullname, staff.username, staff.role, staff.role_id);
        staffArray.push(staffItemIterator);
    }
    );

    const handleClose = (value) => {
        setOpen(false);
        setStaffItem(null);
    };

    return (
        <React.Fragment>
            <ToastContainer position="bottom-right" />
            {staffItem ? <StaffModal
                staffItem={staffItem}
                open={open}
                onClose={handleClose}
                onTriggerReload={() => setReload(!reload)}
                onSuccessEventToast={(msg) => toast.success(msg)}
                onFailureEventToast={(msg) => toast.error(msg)} /> : null}
            <Grid container justify="center" alignItems="center" spacing={3}>
                <Grid item xs={12} sm={6}>
                    <Grid container direction="row" alignItems="center" spacing={3}>
                        <Grid item xs={12} sm={11}>
                            <Title>Персонал</Title>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                            <IconButton color="primary" component="span" size="small" onClick={handleNewStaff}>
                                <AddCircleOutlineOutlinedIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={10}>
                    <TableContainer component={Paper}>
                        <StaffList staff={staffArray} />
                    </TableContainer>
                </Grid>
            </Grid>
            <div className={classes.seeMore}>
                <Link color="primary" href="#" onClick={preventDefault}>{""}</Link>
            </div>
        </React.Fragment>
    );
}
