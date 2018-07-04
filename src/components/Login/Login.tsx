import * as React from 'react';
import './Login.css';
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
import { SetAuth } from '../../actions/login.actions';
import { IState } from '../../store';
import { bindActionCreators } from 'redux';
import LoginService from './LoginService';
import { Button, FormControl, Icon, IconButton, Input, InputAdornment, InputLabel } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

class Login extends React.Component {
    state = { username: '', password: '', error: false, showPassword: false };
    props: any;

    onSubmit($event) {
        $event.preventDefault();
        LoginService.login(this.state.username, this.state.password)
            .then(() => {
                this.props.SetAuth(true);
            })
            .catch(() => this.setState({ error: true }));
    }

    handleChange = prop => event => {
        this.setState({ [prop]: event.target.value, error: false });
    };


    handleMouseDownPassword = event => {
        event.preventDefault();
    };

    handleClickShowPassword = () => {
        this.setState((state: any) => ({ showPassword: !state.showPassword }));
    };

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to={{ pathname: '/', state: { from: this.props.location } }}/>;
        }
        // return <div>
        //     <div className="login">
        //         <h3 className="first">Login</h3>
        //
        //         <form onSubmit={this.onSubmit.bind(this)}>
        //             <div className="ui-inputgroup">
        //                 <span className="ui-inputgroup-addon">
        //                     <i className="fa fa-user"/>
        //                 </span>
        //                 <InputText
        //                     placeholder="Username"
        //                     onChange={(e: any) => this.setState({ username: e.target.value, error: '' })}
        //                     value={this.state.username}
        //                 />
        //             </div>
        //
        //             <div className="ui-inputgroup">
        //                 <span className="ui-inputgroup-addon">
        //                     <i className="fa fa-key"/>
        //                 </span>
        //                 <InputText
        //                     type="password"
        //                     placeholder="Password"
        //                     onChange={(e: any) => this.setState({ password: e.target.value, error: '' })}
        //                     value={this.state.password}
        //                 />
        //             </div>
        //             <div className="error">
        //                 {this.state.error ? this.state.error : null}
        //             </div>
        //
        //             <div className="ui-inputgroup">
        //                 <Button type="submit">Login</Button>
        //             </div>
        //         </form>
        //     </div>
        // </div>

        return <div>
            <form onSubmit={this.onSubmit.bind(this)}>
                <FormControl>
                    <InputLabel htmlFor="username">Username</InputLabel>
                    <Input
                        id="username"
                        value={this.state.username}
                        error={this.state.error}
                        onChange={this.handleChange('username')}
                        endAdornment={<InputAdornment position="end">

                            <IconButton disabled={true}>
                                <Icon className="fa fa-user"/>
                            </IconButton>


                        </InputAdornment>}
                        inputProps={{
                            'aria-label': 'Weight'
                        }}
                    />
                </FormControl>

                <br/>

                <FormControl>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input
                        id="password"
                        type={this.state.showPassword ? 'text' : 'password'}
                        value={this.state.password}
                        onChange={this.handleChange('password')}
                        error={this.state.error}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="Toggle password visibility"
                                    onClick={this.handleClickShowPassword}
                                    onMouseDown={this.handleMouseDownPassword}
                                >
                                    {this.state.showPassword ? <VisibilityOff/> : <Visibility/>}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                <br/>

                <div className="error">
                    {this.state.error ? this.state.error : null}
                </div>

                <FormControl>
                    <Button variant="raised" type="submit" style={{ margin: 15 }} color="primary">Submit</Button>
                </FormControl>
            </form>

        </div>;
    }

}

const mapStateToProps = (state: IState, props: any): any => {
    return {
        ...props,
        isAuthenticated: state.login.isAuthenticated
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    ...bindActionCreators({ SetAuth }, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
