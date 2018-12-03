import React, { Component } from 'react';
import '../../styles/ClassDataTooltips.css';
import { UncontrolledTooltip } from 'reactstrap';

class ClassDataToolTips extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            tooltipOpen: false,
            id: 'placeholder',
            text: '',
            classData: {
                courseTitle: ''
            }

        };
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({ id: nextProps.id, text: nextProps.text });
        if (nextProps.classData) {
            this.setState({ classData: nextProps.classData });
        }
    }

    render() {
        return (
            <span>
                <span id={this.props.id}>
                    {this.state.text}
                </span>
                <UncontrolledTooltip className="tooltip" placement="bottom" autohide={false} target={this.props.id}>
                    {this.state.classData['courseTitle']}
                </UncontrolledTooltip>
            </span>
        );
    }
}

export default ClassDataToolTips;