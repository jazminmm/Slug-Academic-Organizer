import React, { Component } from "react";
import '../../styles/Capstone.css'
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

export default class Capstone extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classes: [],
            taken: {
                CMPS104B: false,
                CMPS117: false,
                CMPS161: false,
                CMPS161L: false,
                CMPS162: false,
                CMPS162L: false,
                CMPS165: false,
                CMPS181: false,
                CMPS183: false,
                CMPS184: false,
                CMPM172: false
            },
            classData: {}
        };

        this.capstoneCompleted = this.capstoneCompleted.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ classes: nextProps.classes });
        let taken = this.state.taken;
        taken = parseTakenClasses(taken, nextProps.classes)
        this.setState({ taken: taken });
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

    capstoneCompleted = () => {
        return (this.state.taken['CMPS104B'] || this.state.taken['CMPS117'] || (this.state.taken['CMPS161'] && this.state.taken['CMPS161L']) ||
            (this.state.taken['CMPS162'] && this.state.taken['CMPS162L']) || this.state.taken['CMPS165'] || this.state.taken['CMPS181'] ||
            this.state.taken['CMPS183'] || this.state.taken['CMPS184'] || this.state.taken['CMPM172']);
    }

    render() {
        return (
            <div className="capstone">
                <h3>Capstone</h3>
                Complete a Senior Thesis or one of the following classes: <hr />
                <div className={this.capstoneCompleted() ? 'capList completed' : 'capList uncompleted'}>
                    <div className="capList1">
                        &bull; <ClassDataTooltips id='cmps104b' text='CMPS104B' classData={this.state.classData['CMPS104B']} />
                        {this.state.taken['CMPS104B'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps117' text='CMPS117' classData={this.state.classData['CMPS117']} />
                        {this.state.taken['CMPS117'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps161l' text='CMPS161/L' classData={this.state.classData['CMPS161']} />
                        {this.state.taken['CMPS161'] && this.state.taken['CMPS161L'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps162l' text='CMPS162/L' classData={this.state.classData['CMPS162']} />
                        {this.state.taken['CMPS162'] && this.state.taken['CMPS162L'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps165' text='CMPS165' classData={this.state.classData['CMPS165']} />
                        {this.state.taken['CMPS165'] && <b>X</b>} <br />
                    </div>
                    <div className="capList2">
                        &bull; <ClassDataTooltips id='cmps181' text='CMPS181' classData={this.state.classData['CMPS181']} />
                        {this.state.taken['CMPS181'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps183' text='CMPS183' classData={this.state.classData['CMPS183']} />
                        {this.state.taken['CMPS183'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmps184' text='CMPS184' classData={this.state.classData['CMPS184']} />
                        {this.state.taken['CMPS184'] && <b>X</b>} <br />
                        &bull; <ClassDataTooltips id='cmpm172' text='CMPM172' classData={this.state.classData['CMPM172']} />
                        {this.state.taken['CMPM172'] && <b>X</b>}
                    </div>
                </div>
            </div>
        );
    }
}