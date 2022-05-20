import React, { useState, useEffect, useRef } from 'react';
import sectionsService from "../services/sectionsService";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import { useInterval } from './useInterval';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    overflow: "auto",
  },
  fixedHeight: {
    height: 220,
  },
  spinner: {
    margin: "30px",
    display: 'flex',
    justifyContent: 'space-around'
  },

  '@keyframes blinker': {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  blinking: {
    animationName: '$blinker',
    animationDuration: '2s',
    animationTimingFunction: 'linear',
    animationIterationCount: 'infinite',
  },
  mycustom: {
    backgroundColor: '#f00'
  },
}));

function Sections() {
  const [sections, setSections] = useState([]);
  let source = sectionsService.cancelToken.source();
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);


  const [mealPrev, setMealPrev] = useState([]);

  useEffect(() => {
    async function fetchInitialProps() {
      const response = await getServerSections();
      assingMealPrev(sections);
      setSections(response);
    }
    fetchInitialProps();
    return () => { source.cancel("Section Component got unmounted"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInterval(() => {
    async function onInterval() {
      const response = await getServerSections();
      assingMealPrev(sections);
      setSections(response);
    }
    onInterval();

  }, 10000);

  const getServerSections = async () => {
    try {
      const response = await sectionsService.getSections(source.token);
      const fetchResult = response.data.body;
      return fetchResult;
    } catch (ex) {
      console.log("Sections couldn't be retrieved");
    }
  }

  function assingMealPrev(data) {
    let tempArray = [];
    data.forEach((sec) => {
      sec.items.forEach((itm) => {
        tempArray.push({ id: itm.meal_id, count: itm.count });
      });
    });

    setMealPrev(tempArray);
  }

  // const checkDifference = async (mealId, itemCount) => {
  //   mealPrev.forEach((meal) => {
  //     if (meal.id == mealId) {
  //       if (meal.count != itemCount) {
  //         console.log("blink");
  //         return true;
  //       }
  //     }
  //   });
  //   return false;
  // }

  return (
    <div className={classes.root}>
      <Grid container spacing={2} >
        {sections.length > 0 ? sections.map(section => (
          <Grid item xs={12} md={sections.length === 1 ? 12 : 4} key={section.id}>
            <Paper className={fixedHeightPaper} elevation={3}>
              <Typography component="h6" variant="h6" color="primary" gutterBottom>
                {section.name}
              </Typography>
              <Divider />
              <List dense>
                {section.items.map((item, index) => (
                  <ListItem divider key={index} style={{ padding: "0 15px 0 15px" }}>
                    <ListItemText primary={item.variationOf > 0 ? `${item.meal}*` : item.meal} />
                    <ListItemSecondaryAction>
                      <Fade in={true} timeout={1500}>
                        <Box color="black" bgcolor="gold" style={{ padding: "0 8px 0 8px" }}>
                          {item.count}
                        </Box>
                      </Fade>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        )) : (<div className={classes.spinner}><CircularProgress size={50} /></div>)}
      </Grid>
    </div>
  );
}

export default Sections;