import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import { withAuth } from '@okta/okta-react';

import GithubRepo from "../GithubRepo"
import SearchBar from "../SearchBar"

import githubClient from '../githubClient'
import APIClient from '../apiClient'


const styles = theme => ({
 root: {
   flexGrow: 1,
   marginTop: 30
 },
 paper: {
   padding: theme.spacing.unit * 2,
   textAlign: 'center',
   color: theme.palette.text.secondary,
 },
});

const Home = (props) => {
    const [value, setValue] = useState(0);
    const [repos, setRepos] = useState([]);
    const [kudos, setKudos] = useState([]);
    const accessToken = props.auth.getAccessToken();
    const apiClient = APIClient(accessToken);

    useEffect(() => {
        apiClient.getKudos().then(data => {
            setKudos(data);
        });
    });

    const handleTabChange = (event, value) => {
        setValue(value);
    };

    const handleTabChangeIndex = index => {
        setValue(index);
    };

    const resetRepos = reposToReset => {
        setRepos(reposToReset);
    };

    const isKudo = repo => {
        return kudos.find(r => r.id == repo.id);
    };

    const onKudo = repo => {
        updateBackend(repo);
    };

    const updateBackend = repo => {
        if(isKudo(repo)) {
            apiClient.deleteKudo(repo);
        } else {
            apiClient.createKudo(repo);
        }

        updateState(repo);
    };

    const updateState = repo => {
        if(isKudo(repo)) {
            let newKudosSet = kudos.filter(r => r.id !== repo.id);
            setKudos(newKudosSet);
        } else {
            let newKudosSet = kudos.push(repo);
            setKudos(newKudosSet);
        }
    }; 

    const onSearch = event => {
        const target = event.target;
        if(!target.value || target.length < 3) {
            return
        }
        if(event.which !== 13) {
            return
        }

        githubClient
            .getJSONRepos(target.value)
            .then(response => {
                target.blur();
                setValue(1);
                resetRepos(response.items);
            });
    };

    const renderRepos = (reposToRender) => {
        if(!reposToRender) {
            return [];
        }
        
        return reposToRender.map((repo) => {
            return (
                <Grid item xs={12} md={3} key={repo.id}>
                    <GithubRepo onKudo={onKudo} isKudo={isKudo(repo)} repo={repo} />
                </Grid>
            );
        });
    };

    return (
        <div className={styles.root}>
            <SearchBar auth={props.auth} onSearch={onSearch} />
            <Tabs
                value={value}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                fullWidth
            >
                <Tab lable="Kudos" />
                <Tab label="Search" />
            </Tabs>

            <SwipeableViews
                axis={'x-reverse'}
                index={value}
                onChangeIndex={handleTabChangeIndex}
            >
                <Grid container spacing={16} style={{padding: '20px 0'}}>
                    {renderRepos(kudos)}
                </Grid>
                <Grid container spacing={16} style={{padding: '20px 0'}}>
                    {renderRepos(repos)}
                </Grid>
            </SwipeableViews>
        </div>
    );
};

export default withStyles(styles)(withAuth(Home));