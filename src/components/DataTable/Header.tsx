import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../../store';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { WorldService } from '../../services/WorldService';
import { LayerService } from '../../services/LayerService';
import { WorldsActions } from '../../actions/world.actions';
import { push } from 'react-router-redux';
import { ITBAction } from '../../consts/action-types';
import { IWorldLayer } from '../../interfaces/IWorldLayer';

export interface IPropsHeader {
    worldName?: string,
    tableType: string,
    globalFilter: any,
    setWorlds: (worlds: IWorld[]) => ITBAction,
    updateWorld: (worlds: IWorld) => ITBAction
}

class Header extends React.Component {
    props: IPropsHeader;
    worldName = this.props.worldName ? this.props.worldName : '';
    tableTitle=`${this.worldName} World's Files List`;

    onInput = (e: any) => {
        this.setState({globalFilter: e.target.value});
    };

    onRefresh = (tableType: string) => {
       console.error("start REFREASH... " + tableType);
       switch (tableType){
           case ('worlds'):
               WorldService.getWorlds().then( worlds => this.props.setWorlds(worlds));
               break;
           case ('layers'):
               LayerService.getAllLayersData(this.worldName)
                   .then( layers => {
                       const name = this.worldName;
                       this.props.updateWorld({ name, layers });
                   });
               break;
       }
    };

    render() {
        return (
            <div>
                <header>
                    <h2 style={{'textAlign':'center'}}>
                        {this.tableTitle}
                    </h2>
                    <div>
                        <span style={{'textAlign':'left'}}>
                            <i className="fa fa-search" style={{margin:'4px 4px 0 0'}}/>
                            <InputText id='search' type="search" /*onInput={this.onInput}*/ placeholder="Global Search" size={30}/>
                        </span>
                        <span className="ui-button-icon ui-helper-clearfix" style={{'float':'right'}}>
                            <Button id='refresh' icon="fa-refresh" onClick={(e: any) => this.onRefresh(this.props.tableType)}/>
                        </span>
                    </div>

                </header>
            </div>
        );
    };
}

const mapStateToProps = (state: IState, { worldName, tableType }: any) => ({ worldName, tableType });

const mapDispatchToProps = (dispatch: any) => ({
    setWorlds: (payload: IWorld[]) => dispatch(WorldsActions.setWorldsAction(payload)),
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);

// <InputText type="search" onInput={(e: any) => this.setState({globalFilter: e.target.value})} placeholder="Global Search" size={50}/>
// <Button id='refresh' icon="fa-refresh" onClick={this.onRefresh(this.props.tableType)}/>
