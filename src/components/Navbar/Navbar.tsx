import * as React from 'react';
import './Navbar.css';
import { AppBar, Icon, IconButton, Toolbar, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { SetAuth } from '../../actions/login.actions';
import { bindActionCreators } from 'redux';
import LoginService from '../Login/LoginService';

class Navbar extends React.Component {
    props: any;

    logout = () => {
        LoginService.logout()
            .then(() => this.props.SetAuth(false));
    };

    render() {
        return <AppBar color="primary" title="My App">
            <Toolbar className="root">

                <IconButton className="menuButton" color="inherit" aria-label="Menu">
                    {/*<Menu/>*/}
                </IconButton>

                <Typography variant="title" color="inherit" className="flex">
                    TB
                </Typography>

                {
                    this.props.login.isAuthenticated ?
                        <IconButton color="inherit" aria-label="Logout" onClick={() => this.logout()}>
                            <Icon className="fa fa-sign-out"/>
                        </IconButton> : null
                }

            </Toolbar>
        </AppBar>;
    }
}

const mapStateToProps = (state: IState, props: any): any => ({ isAuthenticated: state.login.isAuthenticated });
const mapDispatchToProps = (dispatch: any) => bindActionCreators({ SetAuth }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);