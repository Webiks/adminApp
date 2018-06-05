import * as React from 'react';
import './WorldNav.css';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { IState } from '../../index';

const WorldNav = ({ worldName, navigateTo }: any) => (
    <div className="world" onClick={ () => navigateTo(worldName) }>
        <img src="http://icons.iconarchive.com/icons/dtafalonso/modern-xp/512/ModernXP-73-Globe-icon.png"/>
        <div className="text"> {worldName} </div>
    </div>
);

const mapStateToProps = (state: IState, { worldName }: any) => ({
    worldName
});

const mapDispatchToProps = (dispatch: any) => ({
    navigateTo: (location: string) => dispatch(push(location))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldNav);
