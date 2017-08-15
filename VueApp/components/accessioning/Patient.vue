<template>
    <div class="card">
        <div class="card-header card-header-primary">
            <span class="patientDetailsLabel">Patient/Subject Details</span>
            <div class="float-right text-white config-info">To prevent duplicate entries, please search before entering a new record.</div>
        </div>
        <div class="card-block">
            <div class="form-group">
                <!--v-if="typeof(this.patient) != 'undefined'">-->
                <label for="patientName" class="patientLabel label-above">Patient</label>
                <div class="row row-center">
                    <div :class="searchBoxWidth">
                        <multiselect id="patientName"
                                     :options="this.prop_patients"
                                     track-by="id"
                                     label="fullName"
                                     :option-height="104"
                                     :searchable="true"
                                     :custom-label="customPatientDropdownLabel"
                                     :show-labels="false"
                                     :internal-search="true"
                                     :close-on-select="true"
                                     :allow-empty="true"
                                     placeholder="Type to Search..."
                                     v-on:input="patientChanged"
                                     v-on:search-change="patientSearched = true"
                                     v-model="patientState.patient">
                            <span slot="noResult">No Patients Found.</span>
                            <template slot="option" scope="props">
                                <div :id="props.option.id">
                                    {{props.option.lastName}}, {{props.option.firstName}}<br />DOB: {{props.option.dob | prettyDate}}<br />SSN: {{props.option.ssn}}
                                </div>
                            </template>
                        </multiselect>
                    </div>
                    <div class="col-1 col-auto px-0" v-show="this.allowEditSave || this.patientSearched">
                        <div class="tooltipSource">
                            <button class="btn-sm btn-info " v-on:click="addNewPatient">
                                <i class="fa fa-plus"></i>
                            </button>
                            <span class="tooltiptext">Add Patient</span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="form-group col-lg-4 col-auto">
                        <label for="firstNameField" class="label-above">First Name</label>

                        <input id="firstNameField" name="firstNameField" v-validate="'required'" type="text" v-model="patientState.patient.firstName" class="form-control"
                               :disabled="!this.allowEditSave" />
                        <span v-show="errors.has('firstNameField')">{{ errors.first('firstNameField') }}</span>
                    </div>
                    <div class="form-group col-lg-4 col-auto">
                        <label for="lastNameField" class="label-above">Last Name</label>
                        <input id="lastNameField" name="lastNameField" v-validate="'required'" type="text" v-model="patientState.patient.lastName" class="form-control"
                               :disabled="!this.allowEditSave" />
                        <span v-show="errors.has('lastNameField')">{{ errors.first('lastNameField') }}</span>
                    </div>
					<div class="form-group col-lg-4 col-auto">
						<label for="dobField" class="label-above">DOB</label>
						<div id="dobField" :class="['datefield', 'text-nowrap', {'disabled': !this.allowEditSave}]" >
							<input id="month111" name="month" type="text" maxlength="2" placeholder="MM" v-model.number.lazy="computedDobMonth" :disabled="!this.allowEditSave" />/
							<input id="day" name="day" type="text" maxlength="2" placeholder="DD" v-model.number.lazy="computedDobDay" :disabled="!this.allowEditSave" /> /
							<input id="year"  name="year" type="text" maxlength="4" placeholder="YYYY" v-model.number.lazy="computedDobYear" :disabled="!this.allowEditSave" />
						</div>
						<span v-show="errors.has('month') || errors.has('day') || errors.has('year') ">DOB is required</span>
					</div>
					<div class="form-group col-lg-6 col-auto">
						<label for="ssnField" class="label-above">SSN</label>
						<input id="ssnField" type="text" v-model="patientState.patient.ssn" class="form-control"
							   :disabled="!this.allowEditSave" />
					</div>
					<div class="form-group col-lg-6 col-auto">
						<label for="mrnField" class="label-above">MRN</label>
						<input id="mrnField" name="mrnField" v-validate="'required'" type="text" v-model="patientState.mrn" class="form-control"
							   :disabled="!this.allowEditSave" />
						<span v-show="errors.has('mrnField')">{{ errors.first('mrnField') }}</span>
					</div>

				</div>
                <div class="row">
                    <div class="col-auto" v-if="this.allowEditSave">
                        <div class="card card-compact card-no-outer-border ml-1" style="max-width:96%">
                            <div class="cursor-pointer card-header card-header-primary pl-1 modal-header p-q" v-on:click="toggleDetailsVisibility">
                                <label class="cursor-pointer">{{'Demographics (Click to ' + (this.detailsCollapsed ? 'Edit' : 'Collapse') + ')'}}</label>
                                <i class="fa" :class="expandPanelArrow"></i>
                            </div>
                            <div class="card-block">
                                <transition name="collapse-transition">
                                    <div class="row" v-show="!this.detailsCollapsed">

                                        <!--Demographic Section -->
                                        <div v-for="att in getPatientAttributesBySection('Demographics')" class="form-group col-lg-12 col-auto">
                                            <label :for="att.name+'_'+att.type" class="label-above">{{att.label}}</label>
                                            <div class="input-group">

                                                <GooglePlaces v-if="att.type==='location-general'"
                                                              :prop_id="att.name+'_'+att.type"
                                                              :value="currentPatientAttributeValue(patientState.patient, att.name, true)"
                                                              v-on:input="updatePatientAttribute">
                                                </GooglePlaces>

                                                <div v-if="att.type==='single-small'" :id="att.name+'_'+att.type" class="btn-group pl-1" data-toggle="buttons">
                                                    <label v-for="option in att.options"
                                                           :class="option.id === currentPatientAttributeValue(patientState.patient, att.name, true).id ? 'btn btn- btn-radio active' : 'btn btn-radio'"
                                                           v-on:click="updatePatientAttributeValue(att.name, option, true)">
                                                        <input type="radio" autocomplete="off" name="option" :id="option.id"
                                                               :checked="option.id === currentPatientAttributeValue(att.name, true).id"
                                                               v-on:change="updatePatientAttributeValue(att.name, option, false)" />
                                                        {{option.name}}
                                                    </label>
                                                </div>

                                                <div v-if="att.type==='multiple-small'" :id="att.name+'_'+att.type" class="btn-group pl-1" data-toggle="buttons">
                                                    <label v-for="option in att.options" class="btn btn-radio"
                                                           :class="currentPatientAttributeValue(patientState.patient, att.name, false).find(function(v) {option.id === v.id}) ? 'btn btn-radio active' : 'btn btn-radio'"
                                                           v-on:click="updatePatientAttributeValue(att.name, option, true)">
                                                        <input type="checkbox" autocomplete="off" name="option" :id="option.id"
                                                               :checked="currentPatientAttributeValue(patientState.patient, att.name, false).find(function(v) {option.id === v.id})"
                                                               v-on:change="updatePatientAttributeValue(att.name, option, true)" />
                                                        {{option.name}}
                                                    </label>
                                                </div>

                      <multiselect v-if="att.type==='single-large'"
                                   :id="att.name+'_'+att.type"
                                   deselect-label="Can't remove this value"
                                   track-by="id" label="name"
                                   placeholder="Select one" :options="att.options" :searchable="false" :allow-empty="true"
                                   :value="currentPatientAttributeValue(patientState.patient, att.name, true)"
                                   :style="setMinWidth(att.options)"
                                   v-on:input="updatePatientAttribute">
                      </multiselect>


                      <multiselect v-if="att.type==='multiple-large'"
                                   :id="att.name+'_'+att.type"
                                   track-by="id" label="name"
                                   placeholder="Select one or more" :options="att.options" :searchable="true"
                                   :multiple="true" :allow-empty="true"
                                   deselect-label=""
                                   select-label=""
                                   :value="currentPatientAttributeValue(patientState.patient, att.name, false)"
                                   :style="setMinWidth(att.options)"
                                   v-on:input="updatePatientAttribute">
                      </multiselect>

                                                <span v-if="att.informationTooltip != null" class="input-group-addon-clean-small-icon" data-animation="false"
                                                      data-toggle="tooltip" data-placement="top" :title="att.informationTooltip">
                                                    <a v-if="att.informationSource != null" :href="att.informationSource" target="_new">
                                                        <i class="fa fa-info"></i>
                                                    </a>
                                                    <i v-else="" class="fa fa-info"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </transition>
                                <div class="row" v-show="this.allowEditSave && this.detailsCollapsed" v-on:click="toggleDetailsVisibility">
                                    <div class="col-auto">
                                        <PatientInfo :organization="this.organization"
                                                     :patientId="patientState.patient.id"
                                                     :compact=true></PatientInfo>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-6 col-auto">
                        <button class="btn btn-info w-100"
                                v-on:click="uploadDocument('PatientConsent')">
                            <i class="fa fa-paperclip"></i>
                            Attach Consent
                        </button>
                    </div>
                    <div class="col-lg-6 col-auto">
                        <button v-if="this.allowEditSave"
                                class="btn btn-info w-100"
                                v-on:click="savePatient">
                            <i class="fa fa-save"></i>
                            Save Patient
                        </button>
                    </div>
                </div>
            </div>
        </div>
      <div class="sizeCalculator" ref="sizeCalculator"></div>
    </div>
</template>
<script src="./Patient.vue.js">

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style> <!--not pulled in with the js import from node package for some reason.  put this at a top-level?-->