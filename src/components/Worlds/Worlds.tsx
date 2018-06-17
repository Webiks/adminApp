import * as React from 'react';
import { connect } from 'react-redux';
import './Worlds.css';
import WorldNav from '../WorldNav/WorldNav';
import { IState } from '../../store';
import { IWorld } from '../../interfaces/IWorld';
import { WorldsActions } from '../../actions/world.actions';
import { WorldService } from '../../services/WorldService';
import { ITBAction } from '../../consts/action-types';

export interface IPropsWorlds {
    worldsList: IWorld[],
    setWorlds: (world: IWorld[]) => ITBAction
}

class Worlds extends React.Component {
    props: IPropsWorlds;

    // GET: get all worlds on startUp
    componentDidMount() {
        console.log('reducer: start the getWorlds function...');
        WorldService.getWorlds()
            .then((worlds: IWorld[]) => this.props.setWorlds(worlds || []))
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
    console.log(state);
    return {
        worldsList: state.worlds.list
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Worlds);