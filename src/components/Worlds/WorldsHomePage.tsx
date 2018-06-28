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

class WorldsHomePage extends React.Component {
    props: IPropsWorlds;

    // GET: get all worlds on startUp
    componentDidMount() {
        WorldService.getWorlds()
            .then((worlds: IWorld[]) => {
                console.log("world list: " + JSON.stringify(worlds));
                return this.props.setWorlds(worlds || []);
            })
            .catch(error => this.props.setWorlds([]));

    };

    // update the App store and refresh the page
    refresh = (worlds: IWorld[]) => {
        console.log("Worlds Home Page: REFRESH...");
        this.props.setWorlds(worlds);
    };

    render() {
        return (
            <div>
                {this.props.worldsList && <div>
                    <WorldsDataTable/>
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
