import * as React from 'react';
import { IWorld } from '../../interfaces/IWorld';
import { connect } from 'react-redux';
import { IState } from '../../store';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from 'primereact/components/button/Button';

const Header = ({ tableTitle }) => (
    <div>
        <header className="ui-button-icon ui-helper-clearfix" >
            <h2>{tableTitle} <Button icon="fa-refresh" style={{'float':'right'}}/></h2>
        </header>
    </div>

);

const mapStateToProps = (state: IState, { worldName }: any) => {
    return {
        world: state.worlds.list.find(({ name, layers }: IWorld) => worldName === name)
    }
};

export default connect(mapStateToProps)(Header);


