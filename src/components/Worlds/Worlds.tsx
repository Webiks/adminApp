import * as React from 'react';
import { connect } from 'react-redux';
import './Worlds.css';
import WorldNav from '../WorldNav/WorldNav';
import { IState } from '../../store';
import { IWorld } from '../../interfaces/IWorld';
import { SetWorldsAction } from '../../actions/world.actions';
import { WorldService } from '../../services/WorldService';

class Worlds extends React.Component {
    props: any;

    // GET: get all worlds on startUp
    componentDidMount() {
        console.log('reducer: start the getWorlds function...');
        WorldService.getWorlds()
            .then((worlds: IWorld[]) => this.props.setWorlds(worlds))
            .catch(error => console.log(error));
    };

    render() {

        return <div className="worlds"> {
            this.props.worlds.list.map(({ name }: IWorld) => <WorldNav key={name} worldName={name}/>)
        }
        </div>

    }
}

const mapStateToProps = (state: IState) => {
    return {
        worlds: state.worlds
    };
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(SetWorldsAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Worlds);