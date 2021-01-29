import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.updateWithoutSave = this.updateWithoutSave.bind(this);
        this.handleCloseJob = this.handleCloseJob.bind(this);
    };

    init() {
        console.log('Call init Methad')
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)

        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        console.log('Call componentDidMount')
        this.loadData();
    };

    loadData(callback) {
        //var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
        // your ajax call and other logic goes here
        //debugger;
        $.ajax({
            url: 'http://localhost:51689/listing/listing/getEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            dataType: "json",
            success: function (res) {
                //console.log(res.myJobs);
                //console.log("Details saved successfully...");
                this.updateWithoutSave(res.myJobs);
            }.bind(this),
            error: function (res) {
                console.log(res.status);
            }
        });
        this.init();
    }

    updateWithoutSave(newData) {
        //console.log("Updatewithoutsave");
        //console.log(newData);
        this.setState({
            loadJobs: newData,
        })
    }


    loadNewData(data) {
        //console.log('loadNewData');
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    handleCloseJob(id) {
        console.log('handleCloseJob ');
        const currentLoadJobs = TalentUtil.deepCopy(this.state.loadJobs)
        const index = currentLoadJobs.findIndex(job => job.id === id)
        if (currentLoadJobs[index].status === 1) {
            return TalentUtil.notification.show(
                'Job already closed',
                'error',
                null,
                null
            )
        }
        const updatedLoadJobs = currentLoadJobs.filter(job => job.id !== id)
        this.setState({ loadJobs: updatedLoadJobs })
        TalentUtil.notification.show('Job closed', 'error', null, null)
    }

    render() {
        //console.log('call Render ');
        return (
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <h3>List of Jobs</h3>
                    <JobSummaryCard
                        closeJob={this.handleCloseJob}
                        jobs={this.state.loadJobs}
                    />
                </div>

            </BodyWrapper>
        )
    }
}
