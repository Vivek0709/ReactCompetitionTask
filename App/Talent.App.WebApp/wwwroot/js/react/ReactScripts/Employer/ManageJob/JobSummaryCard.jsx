import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Icon, Card, Button, Confirm } from 'semantic-ui-react';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { listingEndpoint } from '../../Services/httpService'


export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            jobs:[],
            confirmOpen: false,
            chosenJobId: ''
        }

        this.selectJob = this.selectJob.bind(this);
        this.handleCloseBtn = this.handleCloseBtn.bind(this)
        this.closeConfirmModal = this.closeConfirmModal.bind(this)
    }

    selectJob() {
        var cookies = Cookies.get('talentAuthToken');
        url: 'http://localhost:51689/listing/listing/closeJob';
        //debugger;
        const { chosenJobId: id } = this.state
        //const url = 'http://localhost:51689/listing/listing/closeJob';
        //const url = listingEndpoint + '/listing/listing/closeJob'
        //var cookies = Cookies.get('talentAuthToken')
        $.ajax({
            url: 'http://localhost:51689/listing/listing/closeJob',
            headers: {
                Authorization: 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: 'POST',
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(this.state.chosenJobId),
            success: function (res) {
                if (res.success == true) {
                    this.props.closeJob(id)
                    this.closeConfirmModal()
                } else {
                    console.log('error: '+res.success)
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }

    handleCloseBtn(id) {
        this.setState({ confirmOpen: true, chosenJobId: id })
    }
    closeConfirmModal() {
        this.setState({ confirmOpen: false })
    }

    render() {
       // console.log(this.props.jobs);
        if (this.props.jobs.length === 0) return <div>No Jobs Found</div>
        return (
            <div className="customized-card">
                <Confirm
                    open={this.state.confirmOpen}
                    content="Are you sure you want to close this job ?"
                    onCancel={this.closeConfirmModal}
                    onConfirm={this.selectJob}
                />
                {this.props.jobs.map(
                    ({ id, title, summary, location, noOfSuggestions }) => (
                        <div key={id} className="customized-card__card">
                            <span className="ribbon">
                                <Icon name="user" /> {noOfSuggestions}
                            </span>
                            <Card style={{ width: '100%', height: '100%' }}>
                                <Card.Content>
                                    <Card.Header>{title}</Card.Header>
                                    <Card.Meta>
                                        {location.city}, {location.country}
                                    </Card.Meta>
                                    <Card.Description>{summary}</Card.Description>
                                </Card.Content>
                                <div className="customized-card__footer">
                                    <div style={{ flexGrow: 1 }} />
                                    <Button
                                        onClick={() => this.handleCloseBtn(id)}
                                        size="mini"
                                        basic
                                        color="blue"
                                    >
                                        <Icon name="close" />Close
                                    </Button>
                                    <Link to={`/EditJob/${id}`}>
                                        <Button size="mini" basic color="blue">
                                            <Icon name="edit outline" /> Edit
                                        </Button>
                                    </Link>
                                    <Button size="mini" basic color="blue">
                                        <Icon name="copy outline" /> Copy
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    )
                )}
            </div>
        )
    }
}