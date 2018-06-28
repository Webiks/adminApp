import * as React from 'react';

import { IWorld } from "../../interfaces/IWorld";
import { IState } from "../../store";
import { connect } from "react-redux";
import { WorldsActions } from '../../actions/world.actions';
import WorldsDataTable from './WorldsDataTable';
import { IPropsWorlds } from '../../interfaces/IPropsWorlds';
import { WorldService } from '../../services/WorldService';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';

export interface IStateWorlds {
    worldsList: any
}

class WorldsHomePage extends React.Component {
    props: IPropsWorlds;
    state: IStateWorlds;

    // GET: get all worlds on startUp
    componentDidMount() {
        this.getWorldsList();
    };

    getWorldsList = () => {
        WorldService.getWorlds()
            .then((worlds: IWorld[]) => {
                // get the input Data of all the worlds (from the App store)
                const worldsInput = worlds.map( (world: IWorld) => this.getInputData(worlds, world));
                this.updateWorlds([...worldsInput]);               // update the App store
            })
            .catch(error => this.props.setWorlds([]));
    };

    // get the input Data of the world from the App store
    getInputData = (worlds: IWorld[], world: IWorld): IWorld => {
        // find the world in the App store if exist
        const worldsList = this.props.worldsList.length === 0 ? worlds : this.props.worldsList;
        const appWorld = worldsList.find(({ name, layers }: IWorld) => world.name === name);
        const worldData =
            {
                name: world.name,
                desc: appWorld.desc ? appWorld.desc : '',
                country: appWorld.country ? appWorld.country : '',
                directory: appWorld.directory ? appWorld.directory : '',
                layers: appWorld.layers ? appWorld.layers : []
            };
        console.warn("getInputData after worldData: " + JSON.stringify(worldData));
        return { ...worldData };
    };

    // update the App store and refresh the page
    refresh = (worlds: IWorld[]) => {
        this.getWorldsList();
    };

    updateWorlds = (worlds: IWorld[]) => {
        this.setState( { worldsList: worlds});
        console.log("Worlds Home Page: UPDATE..." + JSON.stringify(worlds));
        this.props.setWorlds(worlds);
    };

    render() {

        console.warn("Worlds Home Page: RENDER..." + JSON.stringify(this.props.worldsList));
        // this.refresh(this.props.worldsList);

        return (
            <div>
                {this.props.worldsList && <div style={{width:'70%', margin:'auto'}}>
                    <WorldsDataTable />
                </div>}
            </div>

        );
    };
}

const mapStateToProps = (state: IState) => {
    return {
        worldsList: state.worlds.list
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(WorldsHomePage);
