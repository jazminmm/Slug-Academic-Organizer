import React, { Component } from "react";
import '../../styles/DC.css';
import '../../styles/Major.css';
import ClassDataTooltips from "./ClassDataTooltips";

function parseTakenClasses(taken, classes) {
    for (var i = 0; i < classes.length; i++) {
        if (classes[i].courseID in taken) {
            taken[classes[i].courseID] = true;
        }
    }
    return taken;
}

export default class DC extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [],
            taken: {
                CMPS115: false,
                CMPS132W: false,
                CMPS180W: false,
                CMPS185: false,
                CMPS195: false,
                CMPE185: false
            },
            classData: {}
        };
        this.dcCompleted = this.dcCompleted.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ classes: nextProps.classes });
        let taken = this.state.taken;
        taken = parseTakenClasses(taken, nextProps.classes)
        this.setState({ taken: taken });
    }

    dcCompleted = () => {
        return (this.state.taken['CMPS115'] || (this.state.taken['CMPS132'] && this.state.taken['CMPS132W']) || this.state.taken['CMPS185'] ||
            this.state.taken['CMPS195'] || this.state.taken['CMPE185']);
    }

    componentDidMount() {
        this.makePostForClassData(this.state.taken)
            .then(res => this.setState({ classData: res }))
            .catch(err => console.log(err));
    }

    // Post call to the database to get the user classes
    makePostForClassData = async (classes) => {
        const response = await fetch('/api/getMajorClassData', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ classes: classes })
        });

        const body = await response.json();

        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    render() {
        return (
            <div className="DC">
                <h3>Disciplinary Communication</h3>
                Complete one of the following classes: <hr />
                <div className={this.dcCompleted() ? 'dcList completed' : 'dcList uncompleted'}>
                    <div className="dc1">
                        &bull; <ClassDataTooltips id='cmps115' text='CMPS115' classData={this.state.classData['CMPS115']} />
                        {this.state.taken['CMPS115'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps132w' text='CMPS132W' classData={this.state.classData['CMPS132W']} />
                        {this.state.taken['CMPS132W'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps180w' text='CMPS180W' classData={this.state.classData['CMPS180W']} />
                        {this.state.taken['CMPS180W'] && <b>X</b>} <br />
                    </div>
                    <div className="dc2">
                        &bull; <ClassDataTooltips id='cmps185' text='CMPS185' classData={this.state.classData['CMPS185']} />
                        {this.state.taken['CMPS185'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps195' text='CMPS195' classData={this.state.classData['CMPS195']} />
                        {this.state.taken['CMPS195'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmpe185' text='CMPE185' classData={this.state.classData['CMPE185']} />
                        {this.state.taken['CMPE185'] && <b>X</b>}
                    </div>
                </div>
            </div>
        );
    }
}