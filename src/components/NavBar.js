import React from 'react';
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import LocalAtmIcon from '@material-ui/icons/LocalAtm';
import PeopleIcon from '@material-ui/icons/People';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import RestaurantIcon from '@material-ui/icons/Restaurant';
import AssessmentIcon from '@material-ui/icons/Assessment';
import GetAppIcon from '@material-ui/icons/GetApp';

function NavBar(props) {
  return (
    <div>
      <ListItem button component={Link} to="/orders">
        <ListItemIcon style={{ color: "#757de8" }}>
          <ShoppingCartIcon />
        </ListItemIcon>
        <ListItemText primary="Заказы" />
      </ListItem>
      {props.role !== "takeout" ? <ListItem button component={Link} to="/waiters">
        <ListItemIcon style={{ color: "#4caf50" }}>
          <LocalAtmIcon />
        </ListItemIcon>
        <ListItemText primary="Реализация" />
      </ListItem>
        : null
      }
      {props.role !== "takeout" ? <ListItem button component={Link} to="/sections">
        <ListItemIcon style={{ color: "#ffc107" }}>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Кухня" />
      </ListItem>
        : null
      }
      {props.role !== "takeout" ? <ListItem button component={Link} divider to="/report">
        <ListItemIcon style={{ color: "#4caf50" }}>
          <AssessmentIcon />
        </ListItemIcon>
        <ListItemText primary="Отчёт" />
      </ListItem>
        : null
      }
      {props.role !== "takeout" ? <ListItem button component={Link} to="/staff">
        <ListItemIcon style={{ color: "#ffc107" }}>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Персонал" />
      </ListItem>
        : null
      }
      {props.role !== "takeout" ? <ListItem button component={Link} divider to="/menu">
        <ListItemIcon style={{ color: "#4caf50" }}>
          <RestaurantIcon />
        </ListItemIcon>
        <ListItemText primary="Меню" />
      </ListItem>
        : null
      }
      {props.role !== "takeout" ? <ListItem button component={Link} to="/backup">
        <ListItemIcon style={{ color: "#ffc107" }}>
          <GetAppIcon />
        </ListItemIcon>
        <ListItemText primary="Копия" />
      </ListItem>
        : null
      }
      {!props.user ?
        <ListItem button component={Link} to="/login">
          <ListItemIcon>
            <TouchAppIcon />
          </ListItemIcon>
          <ListItemText primary="Вход" />
        </ListItem> :
        <ListItem button component={Link} to="/logout">
          <ListItemIcon style={{ color: "#ff5722" }}>
            <ExitToAppIcon />
          </ListItemIcon >
          <ListItemText primary="Выход" />
        </ListItem>}
    </div>
  );
}


export default withRouter(NavBar);