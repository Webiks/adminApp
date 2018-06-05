import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from '../../index';
import './Worlds.css';
import WorldNav from '../WorldNav/WorldNav';

const Worlds = ({ worlds }: IState) => (
    <div className="worlds">
        {
            worlds.list.map(({ name }) => <WorldNav key={name} worldName={ name }/>)
        }
    </div>
);

const state = (state: IState ) => {
    return {
        worlds: state.worlds
    };
};

export default connect(state)(Worlds);