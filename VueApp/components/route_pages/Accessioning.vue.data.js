module.exports =
    {
        saveState: {
            errorState: false,
            messages: [],
            saveMessage: ''
        },
        accessionState: {
            loaded: false,
            isNew: false,
            savingNow: false,

            //isLoadingClientsAsync: false,
            editingComment: null,
            editorOptions: {
                // some quill options
            },
            accession: {},
            accessionTemplate: {
                "id": 0,
                "guid": "00000000-0000-0000-0000-000000000000",
                "clientId": 0,
                "facilityId": 0,
                "patientId": 0,
                "mrn": '',
                "orderingLabId": 0,
                "specimens": [

                ],
                "cases": [],
                "customData": {
                    comments: []
                }
            },
            //clients: [
            //    {
            //        "id": 0,
            //        "name": '',
            //        "facilities": [
            //            {
            //                "id": 0,
            //                "name": ''
            //            }],
            //    },
            //],
            //labs: [
            //    {
            //        "id": 0,
            //        "name": '',
            //    },
            //],
            barcodes: []
        }
    };