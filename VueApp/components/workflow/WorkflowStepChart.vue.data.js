enmodule.exports = {
    data: function () {
        return {
            entityLocal: null,
            "workflow": {
                "name": "Histology",
                "location": "Station 1",
                "available": true,
                "department": "Accessioning",
                "laboratory": "Default Laboratory",
                "currentStep": "Step 1",
                "lastUpdated": "2017-07-11T02:59:02.158Z",
                "stepStarted": "2017-07-11T02:59:02.158Z",
                "userFullName": "Partner User"
            },
            workflowHistory: { //load from specimen customdata
                timeStarted: '',
                timeCompleted: '',
                userFullName: '',
                laboratory: 'Temporarily Unavailable',
                department: 'Temporarily Unavailable',
                location: 'Temporarily Unavailable',
                workflow: '',
                workflowStep: ''
            },
            currentWorkflow: { //load from specimen customdata
                name: '',
                currentStep: '',
                laboratory: 'Temporarily Unavailable', //TODO: implement tracking station features
                department: 'Temporarily Unavailable',
                location: 'Temporarily Unavailable',
                userFullName: '',
                userId: '',
                stepStarted: '',
                lastUpdated: '',
                available: true
            },
            allWorkFlows: null //load from organization per specimen
        }
    }
}