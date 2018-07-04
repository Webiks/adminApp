import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from '../../store';

/* Prime React components */
import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'font-awesome/css/font-awesome.css';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';


export interface IPropsHeader {
    worldName?: string,
    tableType: string,
    // globalFilter: any
}

export interface IStateDetails {
    globalFilter: any
}

class Header extends React.Component {
    props: IPropsHeader;
    worldName = this.props.worldName ? this.props.worldName : '';
    state = {};

    componentDidMount() {
        this.setTableTitle(this.props.tableType);
    };

    setTableTitle = (tableType: string): string => {
        let tableTitle: string = '';
        switch (tableType){
        case ('worlds'):
            tableTitle =`Worlds List`;
            break;
        case ('layers'):
            tableTitle =`${this.worldName} World's Files List`;
            break;
        case ('editor'):
            tableTitle =`File Editor`;
            break;
        }
        return tableTitle;
    };

    onInput = (e: any) => {
        this.setState({globalFilter: e.target.value});
    };

    render() {
        return (
            <div>
                <header>
                    <h2 style={{'textAlign':'center'}}>
                        {this.setTableTitle(this.props.tableType)}
                    </h2>
                    <div>
                        <span style={{'textAlign':'left'}}>
                            <i className="fa fa-search" style={{margin:'4px 4px 0 0'}}/>
                            <InputText id='search' type="search"  /*onInput={(e: any) => this.setState({globalFilter: e.target.value})}*/ placeholder="Global Search" size={30}/>
                        </span>
                    </div>
                </header>
            </div>
        );
    };
}

const mapStateToProps = (state: IState, { ...props }: any) =>
    ({ ...props });


export default connect(mapStateToProps)(Header);

// <InputText type="search" onInput={(e: any) => this.setState({globalFilter: e.target.value})} placeholder="Global Search" size={50}/>
// <Button id='refresh' icon="fa-refresh" onClick={this.onRefresh(this.props.tableType)}/>
