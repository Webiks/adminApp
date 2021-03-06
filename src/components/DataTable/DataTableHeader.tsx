import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from '../../store';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import { InputText } from 'primereact/components/inputtext/InputText';


export interface IPropsHeader {
    title: string,
    // globalFilter: any
}

export interface IStateDetails {
    globalFilter: any
}

class DataTableHeader extends React.Component {
    props: IPropsHeader;
    state = {};

    onInput = (e: any) => {
        this.setState({globalFilter: e.target.value});
    };

    render() {
        return (
            <header>
                <h2 style={{'textAlign':'center'}}>
                    {this.props.title}
                </h2>
                <div style={{'textAlign':'center'}}>
                    <i className="fa fa-search" style={{margin:'4px 4px 0 0'}}/>
                    <InputText id='search' type="search"  /*onInput={(e: any) => this.setState({globalFilter: e.target.value})}*/ placeholder="Global Search" size={30}/>
                </div>
            </header>
        );
    };
}

const mapStateToProps = (state: IState, { title }: any) => ({ title });

export default connect(mapStateToProps)(DataTableHeader);

