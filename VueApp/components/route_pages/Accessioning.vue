<template>
	<div id="accessioningMain" class="container-fluid p-lg-1 p-md-0 p-sm-0">
		<div id="loadingModal" tabindex="-1" class="modal-full" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-info" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        Stand By
                    </div>
                    <div class="modal-body text-center">
                        <h4>
                            <i class="fa fa-spinner fa-spin"></i> {{accessionState.currentAction}}
                            <span class="accessionLabel">Accession</span>
                            <span v-if="!accessionState.currentAction.endsWith('New') && accessionState.loaded"> ID {{accessionState.accession.id}}</span>
                        </h4>
                    </div>
                    <div class="modal-footer"></div>
                </div>
            </div>
        </div>
        <div>
            <transition name="fade">
                <div v-if="saveState.errorState" class="alert alert-danger p-1">
                    {{saveState.saveMessage}}
                    <a href="#" class="close" data-dismiss="alert">&times;</a>
                </div>
                <div v-else-if="accessionState.savedStatus === 'success'" class="alert alert-success p-1">
                    {{saveState.saveMessage}}
                    <a href="#" class="close" data-dismiss="alert">&times;</a>
                </div>
            </transition>
        </div>
        <div v-if="accessionState.loaded">
			<div class="row">
                <div class="col-xl-2 col-lg-3 col-12">
                    <div class="row">
                        <div class="col-12">
                            <div class="card card-inverse card-primary">
                                <div class="card-block">
                                    <div v-if="accessionState.isNew" class="row">
                                        <div class="col-12">
                                            <i class="icon-chemistry font-2xl mr-1 float-left"></i>
                                            <div class="text-uppercase font-weight-bold font-xs">New <span class="accessionLabel">Accession</span></div>
                                        </div>
                                    </div>
                                    <div v-else class="row">
                                        <div class="col-12">
                                            <i class="icon-chemistry font-2xl mr-1 float-left"></i>
                                            <div class="text-uppercase font-weight-bold font-xs"><span class="accessionLabel">Accession</span> ID {{accessionState.accession.id}}</div>
                                            {{accessionState.accession.createdDate | prettyDate}}
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="dropdown w-100 mt-1 btn-icon-vertical-text-middle">
                                                <button
                                                        class="btn btn-info btn-sm dropdown-toggle w-100"
                                                        type="button"
                                                        id="saveAccessionDropdown"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false">
                                                    <i class="fa fa-save font-2xl float-left"></i>
                                                    Save Accession
                                                </button>
                                                <div class="dropdown-menu dropdown-menu-info dropdown-menu-right" aria-labelledby="saveAccessionDropdown">
                                                    <div class="dropdown-item-info" v-on:click="saveAccession(true)">Save and Launch</div>
                                                    <div class="dropdown-item-info" v-on:click="saveAccession(false)">Save and Hold</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="dropdown w-100 mt-1">
                                                <button class="btn btn-info btn-sm dropdown-toggle w-100 btn-icon-vertical-text-middle"
                                                        type="button"
                                                        id="printDropdown"
                                                        data-toggle="dropdown"
                                                        aria-haspopup="true"
                                                        aria-expanded="false">
                                                    <i class="fa fa-print font-2xl float-left"></i>
                                                    Print
                                                </button>
                                                <div class="dropdown-menu dropdown-menu-info dropdown-menu-right" aria-labelledby="printDropdown">
                                                    <div class="dropdown-item-info" v-on:click="printAccession">Print <span class="accessionLabel">Accession</span></div>
                                                    <div class="dropdown-item-info" v-on:click="printLabels">Print Labels</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-12">
                                        <div v-if="!accessionState.isNew" class="row">
                                            <button class="btn btn-info btn-sm w-100 mt-1 btn-icon-vertical-text-middle" v-on:click="newAccession(true)">
                                                <i class="fa fa-file-o font-2xl float-left"></i>
                                                New Accession
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-5 col-lg-9 col-12">
					
					
                  <!--<input v-validate="'required|email'" type="text" name="email">
                    <span v-show="errors.has('email')">{{ errors.first('email') }}</span>-->
                    <div class="card">
                        <div class="card-header card-header-primary">
                            <span class="clientDetailsLabel">Accession Details</span>
                        </div>
						
                        <div class="card-block">
                            <div class="form-group">
                                <label for="clientName" class="clientLabel label-above">Institution</label>
                                <multiselect v-if="accessionState.loaded" name="clientName" id="clientName"
                                             :options="clients" track-by="id" label="name"
                                             :searchable="true" :close-on-select="true"
                                             placeholder="Type to Search..."
                                             v-model="client">
                                </multiselect>
								<span v-show="!client">Institution is required</span>
                                <label for="facilityName" class="facilityLabel label-above">Facility</label>
                                <multiselect v-if="accessionState.loaded" id="facilityName"
                                             :options="this.facilities" track-by="id" label="name"
                                             :searchable="true" :close-on-select="true"
                                             v-model="facility"
                                             placeholder="Select...">
                                    <!--v-on:select="faciltyChanged"
                                       :value="facility"
                                        :loading="this.accessionState.isLoadingClientsAsync"-->
                                </multiselect>
								<span v-show="!facility || !facility.id">Facility is required</span>
                            </div>
                            <div class="form-group">
                                <label for="labName" class="labLabel label-above">Received At</label>
                                <multiselect v-if="accessionState.loaded" id="labName"
                                             :options="labs" track-by="id" label="name"
                                             :searchable="true" :close-on-select="true"
                                             placeholder="Type to Search..."
                                             v-model="lab">
                                </multiselect>
								<span v-show="!lab">Received At is required</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xl-5 col-12">
                    <Patient v-if="accessionState.loaded && organization.href != null"
                             :prop_patientId="accessionState.isNew ? 0 : accessionState.accession.patientId"
                             :prop_mrn="accessionState.isNew ? '' : accessionState.accession.mrn"
                             :organization="this.organization"
                             :user="this.user"
                             :prop_patients="this.patients"
                             :prop_accessionSavingNow="accessionState.savingNow"
                             v-on:new="patient_changed"
                             v-on:changed="patient_changed" />
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <Specimens v-if="accessionState.loaded"
                               v-model="accessionState.accession.specimens"
                               :barcodes="accessionState.barcodes"
                               :organization="organization">
                    </Specimens>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header card-header-primary">
                            Comments/Notes
                            <div class="dropdown float-right">
                                <button class="btn btn-info btn-sm dropdown-toggle"
                                        id="addSpecBtn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-plus-circle"></i> Add Comment
                                </button>
                                <div class="dropdown-menu" aria-labelledby="addSpecBtn">
                                    <div class="dropdown-item" v-on:click="addComment('Accession')">Accession</div>
                                    <div class="dropdown-item" v-on:click="addComment('Specimen')">Specimen</div>
                                    <div class="dropdown-item" v-on:click="addComment('Patient')">Patient</div>
                                </div>
                            </div>
                        </div>
                        <div v-if="accessionState.accession.customData.comments.length > 0" class="card-block">
                            <div class="row m-0 p-0">
                                <div class="col-6" style="overflow: auto;">
                                    <table class="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Type</th>
                                                <th>Date</th>
                                                <th>Comment Text</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="comment in accessionState.accession.customData.comments"
                                                v-if="accessionState.loaded"
                                                v-on:click="editComment(comment)"
                                                :class="(comment === accessionState.editingComment ? 'bg-info' : '') + ' cursor-pointer'">
                                                <td style="min-width:7rem">{{comment.user}}</td>
                                                <td style="min-width:5rem">{{comment.type}}</td>
                                                <td style="min-width:10rem">{{comment.dateTime | localeDate}}</td>
                                                <td><div class="htmlWrapColumn"><p v-html="comment.html"></p></div></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div class="col-6">
                                    <QuillEditor v-if="accessionState.editingComment !== null"
                                                 v-model="accessionState.editingComment.html"
                                                 ref="commentEditor"
                                                 :options="accessionState.editorOptions"
                                                 v-on:blur="onEditorBlur($event)"
                                                 v-on:focus="onEditorFocus($event)"
                                                 v-on:ready="onEditorReady($event)">
                                    </QuillEditor>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-10"></div>
                <div class="col-2">
                    <div class="dropdown dropup w-100 btn-icon-vertical-text-middle">
						<button class="btn btn-info btn-sm dropdown-toggle pr-1 pl-1 float-right"
                                type="button"
                                id="saveAccessionDropdown"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false">
							<i class="fa fa-save font-2xl float-left"></i>&nbsp;
							Save Accession
						</button>

						<div class="dropdown-menu dropdown-menu-info dropdown-menu-right" aria-labelledby="saveAccessionDropdown">
                            <div class="dropdown-item-info" v-on:click="saveAccession(true)">Save and Launch</div>
                            <div class="dropdown-item-info" v-on:click="saveAccession(false)">Save and Hold</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script src="./Accessioning.vue.js">

</script>
<style>

</style>
