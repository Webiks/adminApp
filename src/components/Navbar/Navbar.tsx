import * as React from 'react';
import './Navbar.css';
import { AppBar, Fade, Icon, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { SetAuth } from '../../actions/login.actions';
import { bindActionCreators } from 'redux';
import LoginService from '../Login/LoginService';

class Navbar extends React.Component {
    props: any;
    state = { anchorEl: null };

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
                    this.props.isAuthenticated ?
                        <div>
                            <IconButton color="inherit"
                                        aria-label="Logout"
                                        aria-owns="menu-user"
                                        onClick={(event) => this.setState({ anchorEl: event.currentTarget })}>
                                <Icon className="fa fa-user"/>
                            </IconButton>

                            <Menu
                                id="menu-user"
                                disableAutoFocus={true}
                                anchorEl={this.state.anchorEl}
                                open={Boolean(this.state.anchorEl)}
                                onClose={() => this.setState({ anchorEl: null })}
                                TransitionComponent={Fade}>
                                <MenuItem onClick={() => this.logout()}>
                                    Logout
                                    <IconButton aria-label="Logout">
                                        <Icon className="fa fa-sign-out"/>
                                    </IconButton>
                                </MenuItem>
                            </Menu>
                        </div>

                        : null
                }

            </Toolbar>
        </AppBar>;
    }
}

const mapStateToProps = (state: IState, props: any): any => ({ isAuthenticated: state.login.isAuthenticated });
const mapDispatchToProps = (dispatch: any) => bindActionCreators({ SetAuth }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);