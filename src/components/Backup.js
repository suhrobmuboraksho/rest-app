import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import reportService from './../services/reportService';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { green, red } from '@material-ui/core/colors';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
    downloadButton: {
        display: "flex",
        marginTop: "10px",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    }
}));

function Backup(props) {
    const [backup, setBackup] = useState(false);
    const [link, setLink] = useState("");
    const [stepsCompleted, setStepsCompleted] = useState([]);
    const [showDownloadButton, setShowDownloadButton] = useState(false);
    const classes = useStyles();
    let source = reportService.cancelToken.source();

    const serverSync = async () => {
        try {
            const response = await reportService.getBackup(source.token);
            const fetchBody = response.data.body;
            return fetchBody;
        } catch (ex) {
            console.log(ex);
            console.log("Failed to backup");
            return [];
        }
    };

    const handleBackup = async () => {
        let messageArray = [
            { code: 1, status: 1, message: "Папка удачно создана на сервере" },
            { code: 2, status: 1, message: "База данных удачно скопировано" },
            { code: 3, status: 1, message: "Архивация .zip прошла успешно" },
            { code: 4, status: 1, message: "Лишние папки удалены после архивации" },
            { code: 7, status: 1, message: "Архив создан. USB флешка монтирована" },
            { code: 7, status: 1, message: "Архив создан. Скопировано на USB флешку" },
            { code: 7, status: 1, message: "Архив создан. Можете нажать на ссылку чтобы скачать" },
        ];

        try {
            const tempBackup = await serverSync();

            if (tempBackup.code * 1 > 0) {
                messageArray.forEach((msg) => {
                    if (msg.code >= tempBackup.code) {
                        msg.status = 2;
                    }
                });
            }
            else if (tempBackup.code * 1 === 0) {
                messageArray.pop();
            }

            if (tempBackup.code * 1 === 7) {
                setTimeout(() => {
                    setShowDownloadButton(true);
                }, 8 * 500);

            }

            setStepsCompleted([]);

            messageArray.forEach((message, index) => {
                setTimeout(() => {
                    setStepsCompleted((stepsCompleted) => [...stepsCompleted, stepsCompletedRow(message)]);
                }, (index + 1) * 500);
            });

            setLink(process.env.REACT_APP_API_URL + '/' + tempBackup.link);
            console.log(link);
            setBackup(!backup);

        } catch (ex) {
            console.log(ex);
        }
    }

    let keyIndex = 0;
    const stepsCompletedRow = (message) => {
        return (
            <Fade in={true} timeout={1500} key={keyIndex++}>
                <TableRow>
                    <TableCell>{message.status === 1 ?
                        <CheckCircleIcon style={{ color: green[400] }} /> :
                        <RemoveCircleOutlineIcon style={{ color: red[400] }} />
                    }</TableCell>
                    <TableCell>{message.message}</TableCell>
                </TableRow>
            </Fade>
        );
    }

    const handleDownload = () => {
        window.open(`${link}`, "_blank");
    }

    return (
        <Grid container justify="center" alignItems="flex-start" direction="row" spacing={3}>
            <Grid item xs={12} md={6} sm={6}>
                <Button variant="contained" color="secondary" size="small" onClick={handleBackup}>
                    Совершить Бэкап
                </Button>
            </Grid>
            <Grid item xs={12} md={6} sm={6}>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableBody>
                            {stepsCompleted}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box className={classes.downloadButton}>
                    {showDownloadButton ? <Button variant="contained" color="primary" size="small" onClick={handleDownload} style={{ width: "160px" }}>
                        Скачать
                    </Button> : null}
                </Box>
            </Grid>
        </Grid>

    );


}

export default Backup;