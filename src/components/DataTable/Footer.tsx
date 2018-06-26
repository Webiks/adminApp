import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../../store';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import UploadFile from '../WorldLayers/UploadFile';

const Footer = ({ worldName }) => (
    <UploadFile worldName={worldName}/>
);

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name),
        worldName
    }
};

export default connect(mapStateToProps)(Footer);



