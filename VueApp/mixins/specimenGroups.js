
import Vue from 'vue';
const uuidV1 = require('uuid/v1');
import cloneDeep from 'lodash/cloneDeep'

Vue.mixin({
    props: {
        primaryGroupGuid: String
    },
    data: function () {
        return {
            topLevelGroupRecords: [],
        }
    },
    methods: {
        getSpecimenGroupedList: function (accession) {
            var sortedSpecimens = accession.specimens.sort(function (a, b) { return a.id - b.id; });
            var specimenGroupedList = [];

            sortedSpecimens.forEach(function (spec) {
                if (specimenGroupedList.findIndex(function (sg) { return sg.groupGuid === spec.customData.groupGuid; }) < 0) {
                    specimenGroupedList.push({
                        groupGuid: spec.customData.groupGuid,
                        primarySpecimen: spec,
                        specimens: [spec]
                    });
                }
                else {
                    specimenGroupedList.find(function (sg) { return sg.groupGuid === spec.customData.groupGuid; }).specimens.push(spec);
                }
            });

            return specimenGroupedList;
        },

        getGroupSize: function (group) { //todo workflow step or other criteria for AVAILABLE specimens only
            return group.specimens.length;
        },
    }
});