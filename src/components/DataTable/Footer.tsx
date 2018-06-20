import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { IPropsLayers } from '../../interfaces/IPropsLayers';
import UploadFile from '../UploadFile';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { ProgressBar } from 'primereact/components/progressbar/ProgressBar';
import { WorldsActions } from '../../actions/world.actions';

export interface IStateProgress {
    displayProgressBar: boolean,
    value1: number
}

class Footer extends React.Component {

    props: IPropsLayers;

    state: IStateProgress = {
        displayProgressBar: false,
        value1: 0
    };

    onUpload(e) {
        e.preventDefault();
        this.setState({
            displayProgressBar: false,
            value1: 0
        });
    };

    render(){
        return (
            <UploadFile worldName={ this.props.world.name }
                        onProgress={(e:any) => <ProgressBar value={this.state.value1} showValue={this.state.displayProgressBar} />}
                        onUpload={this.onUpload}
            />
        );
    }
}

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

const mapDispatchToProps = (dispatch: any) => ({
    updateWorld: (payload: IWorld) => dispatch(WorldsActions.updateWorldAction(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);



