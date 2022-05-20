import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import user from "../services/userService";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    dialogAction: {
        marginRight: "15px",
        marginBottom: "5px"
    },
}));

function StaffModal(props) {
    const [staffItem] = useState(props.staffItem)
    const [fullname, setFullname] = useState(staffItem.fullname);
    const [username, setUsername] = useState(staffItem.username);
    const [role, setRole] = useState(staffItem.roleId);
    const [password, setPassword] = useState("");
    const classes = useStyles();

    const roles = [
        {
            value: '4',
            label: 'Официант',
        },
        {
            value: '2',
            label: 'Менеджер',
        },
        {
            value: '5',
            label: 'Оператор',
        }
    ];

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            await user.register(fullname, username, password, role);
            props.onClose();
            props.onTriggerReload();
            props.onSuccessEventToast(`Регистрация ${fullname} прошла успешно.`);
        } catch (ex) {
            props.onFailureEventToast(`Не удалось зарегистрировать ${fullname}.`);
            if (ex.response && ex.response.status === 404) {
                props.onFailureEventToast("Запрашиваемый ресурс не найден!");
            }
        }
    };

    const handleUpdate = async () => {
        try {
            await user.updateStaff(staffItem.id, fullname, password);
            props.onClose();
            props.onTriggerReload();
            props.onSuccessEventToast(`Данные для ${staffItem.fullname} успешно сохранены.`);
        } catch (ex) {
            props.onFailureEventToast(`Не удалось сохранить данные${staffItem.fullname}.`);
            console.log("Personnel couldn't be updated");
        }
    }

    const handleDelete = async () => {
        try {
            await user.deleteStaff(staffItem.id);
            props.onClose();
            props.onTriggerReload();
            props.onSuccessEventToast(`${staffItem.fullname} был успешно удалён.`);
        } catch (ex) {
            props.onFailureEventToast(`Не удалось удалить ${staffItem.fullname}.`);
            console.log("Personnel couldn't be deleted");
        }
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose}>
            <DialogTitle>{staffItem.id === "0" ? "Регистрация Персонала" : "Изменение данных персонала"}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    required
                    variant="outlined"
                    margin="dense"
                    id="name"
                    label="Имя и Фамилия"
                    type="text"
                    fullWidth
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                />
                <TextField
                    required
                    variant="outlined"
                    margin="dense"
                    id="login"
                    label="Логин"
                    type="text"
                    fullWidth
                    disabled={staffItem.id > 0 ? true : false}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    required
                    variant="outlined"
                    margin="dense"
                    id="password"
                    label="Пароль"
                    type="password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {staffItem.id === "0" ? <TextField
                    required
                    margin="dense"
                    variant="outlined"
                    fullWidth
                    select
                    label="Роль"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    SelectProps={{
                        native: true,
                    }}
                >
                    {roles.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </TextField> : null}
            </DialogContent>
            <DialogActions className={classes.dialogAction}>
                <Button variant="contained" onClick={props.onClose}>
                    Отмена
                </Button>
                {staffItem.id !== "0" && staffItem.roleId !== "3" ? <Button variant="contained" color="secondary" onClick={handleDelete}>
                    Удалить
                </Button> : null}
                {staffItem.id !== "0" ? <Button variant="contained" color="primary" onClick={handleUpdate}>
                    Изменить
                </Button> : <Button variant="contained" color="primary" onClick={handleRegistration}>
                    Регистрация
                </Button>}
            </DialogActions>
        </Dialog>
    );
}

export default StaffModal;

