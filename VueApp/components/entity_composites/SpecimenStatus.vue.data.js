module.exports =
    {
        specimenHistory: { //load from specimen customdata
            timeStarted: '',
            timeCompleted: '',
            userFullName: '',
            laboratory: 'Default Laboratory',
            department: 'Accessioning',
            location: 'Station 1',
            workflow: '',
            workflowStep: ''
        },
        currentWorkflow: { //load from specimen customdata
            name: '',
            currentStep: '',
            laboratory: 'Default Laboratory',
            department: 'Accessioning',
            location: 'Station 1',
            userFullName: '',
            stepStarted: '',
            lastUpdated: '',
            available: true
        },
        allWorkFlows: null //load from organization per specimen
    };