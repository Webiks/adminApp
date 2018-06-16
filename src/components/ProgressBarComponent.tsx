import * as React from 'react';

/* Prime React components */
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import { ProgressBar } from 'primereact/components/progressbar/ProgressBar';
// import {Growl} from 'primereact/components/growl/Growl';

class ProgressBarComponent extends React.Component {
    props: any;
    state = {value1: 0, value2: 50};
    interval: any;
    // growl: any;

    componentDidMount() {
        this.interval = setInterval(() => {
            let val = this.state.value1;
            val += Math.floor(Math.random() * 10) + 1;
            if(val >= 100) {
                val = 100;
                // this.growl.show({severity: 'info', summary: 'Success', detail: 'Process Completed'});
                clearInterval(this.interval);
            }
            this.setState({value1: val});
        }, 2000);
    }

    render() {
        return (
            <div>
                <div className="content-section implementation">
                    <ProgressBar value={this.state.value1}/>
                </div>
            </div>
        );
    }
}

export default ProgressBarComponent;

// <Growl ref={(el) => { this.growl = el; }}/>