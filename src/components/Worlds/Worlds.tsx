import * as React from 'react';
import { connect } from 'react-redux';
import './Worlds.css';
import WorldNav from '../WorldNav/WorldNav';
import { IState } from '../../store';
import { IWorld } from '../../interfaces/IWorld';
import { WorldService } from '../../services/WorldService';
import { WorldsActions } from '../../actions/world.actions';
import { IPropsWorlds } from '../../interfaces/IPropsWorlds';

class Worlds extends React.Component {
    props: IPropsWorlds;

    // GET: get all worlds on startUp
    componentDidMount() {
        WorldService.getWorlds()
            .then((worlds: IWorld[]) => {
                console.log('world list: ' + JSON.stringify(worlds));
                return this.props.setWorlds(worlds || []);
            })
            .catch(error => this.props.setWorlds([]));

    };

    render() {
        return <div>
            <div className="worlds"> {
                this.props.worldsList.map(({ name }: IWorld) => <WorldNav key={name} worldName={name}/>)
            }
            </div>
        </div>

    }
}

const mapStateToProps = (state: IState) => ({
    worldsList: state.worlds.list
});

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Worlds);