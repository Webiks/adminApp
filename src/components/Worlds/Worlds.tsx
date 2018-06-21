import * as React from 'react';
import { connect } from 'react-redux';
import './Worlds.css';
import WorldNav from '../WorldNav/WorldNav';
import { IState } from '../../store';
import { IWorld } from '../../interfaces/IWorld';
import { WorldService } from '../../services/WorldService';
import { ITBAction } from '../../consts/action-types';
import { WorldsActions } from '../../actions/world.actions';

export interface IPropsWorlds {
    worldsList: IWorld[],
    setWorlds: (worlds: IWorld[]) => ITBAction
}

class Worlds extends React.Component {
    props: IPropsWorlds;

    // GET: get all worlds on startUp
    componentDidMount() {
        console.log("app props: " + JSON.stringify(this.props));
        WorldService.getWorlds()
            .then((worlds: IWorld[]) => {
                console.log("world list: " + JSON.stringify(worlds));
                return this.props.setWorlds(worlds || []);
            })
            .catch(error => this.props.setWorlds([]));

    };

    render() {
        return  <div className="worlds"> {
                    this.props.worldsList.map(({ name }: IWorld) => <WorldNav key={name} worldName={name}/>)
                }
                </div>
    }
}

const mapStateToProps = (state: IState) => {
    console.log("Worlds state: " + JSON.stringify(state));
    return {
        worldsList: state.worlds.list
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Worlds);