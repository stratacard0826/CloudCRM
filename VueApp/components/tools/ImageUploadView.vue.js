import Dropzone from 'vue2-dropzone';
import axios from 'axios';
require('../../assets/js/Array.prototype.unique.js');

module.exports = {
    name: "ImageUploadView",
    props: {
        relationship_type: String,
        relationship_guid: String,
        existing_images: Array,
        read_only: Boolean,
        hide_header: Boolean,
        width: { default: '200px', type: String },
        height: { default: '200px', type: String }
    },
    components: {
        Dropzone
    },
    data: function() {
        return {
            images_all: [],
            images_loaded: false
        }
    },
    created: function() {
        var vm = this;
        vm.$set(vm, 'images_all', Array.isArray(vm.existing_images) ? vm.existing_images.map(function(i) {
            return { guid: i, caption: "", description: "" };
        }) : []);
    },
    mounted: function() {
        var vm = this;
        if (!vm.read_only && !vm.images_loaded) {
            vm.setExistingImages();
            vm.$set(vm, 'images_loaded', true);
        }
    },
    watch: {
        existing_images: function () {
            var vm = this;
            vm.$set(vm, 'images_all', Array.isArray(vm.existing_images) ? vm.existing_images.map(function (i) {
                return { guid: i, caption: "", description: "" };
            }) : []);
        }
    },
    methods: {

        captionChanged: function(event) {
            console.log($(event.target).val());
            console.log($(event.target).attr("id"));
        },

        descriptionChanged: function(event) {
            console.log($(event.target).val())
            console.log($(event.target).attr("id"));
        },

        openImage: function(guid, fileName) {
            window.open('/api/image/' + guid, 'Image', 'fileName=' + fileName + ';resizable=1');
        },

        imageUploadSuccess: function(file, response) {
            var vm = this;
            vm.images_all.push({ guid: response.guid, caption: "", description: "" });
            vm.$set(file, 'id', response.guid);
            vm.setImageAttributes(file);
            vm.$emit('uploaded_images_changed', vm.relationship_guid, vm.images_all.map(i => i.guid).unique());
        },

        imageAdded: function(file) {
            var vm = this;           
            var preview = $(file.previewElement);
            vm.$nextTick(function() {
                if (typeof file.id !== 'undefined') { //file hasn't been uploaded yet
                    vm.setImageAttributes(file);
                }
                preview.find('.dz-details').on("click", function() {
                    //console.log(file.id);
                    //window.open('/api/image/' + file.id, 'Image', 'fileName=' + file.name + ';resizable=1');
                    vm.openImage(file.id, file.name);
                });
            });
        },

        setImageAttributes: function(file) {
            var vm = this;
            var preview = $(file.previewElement);

            var caption = preview.find(".dz-image-caption");
            caption.attr("id", "caption_" + file.id);
            caption.val(vm.images_all.find(i => i.guid === file.id).caption);
            caption.on('change', vm.captionChanged);

            var description = preview.find(".dz-image-description");
            description.attr("id", "description_" + file.id);
            description.val(vm.images_all.find(i => i.guid === file.id).description);
            description.on('change', vm.descriptionChanged);

            preview.find(".dz-details").css("height", vm.height);
            preview.find(".dz-remove").css("top", "calc(" + vm.height + " - 50px)");
        },

        //note that this removes the image from the specimen but not from the database
        //the database image retains the relationship information in customdata, if ever need to recover.
        imageRemoved: function(file) {
            var vm = this;
            var index = vm.images_all.findIndex(i => i.guid === file.id);
            if (index > -1) {
                vm.images_all.splice(index, 1);
                vm.$emit('uploaded_images_changed', vm.relationship_guid, vm.images_all.unique());
            }
        },

        setExistingImages: function() {
            var vm = this;

            var dropzone = vm.$refs["dropzone" + vm.relationship_guid];

            if (typeof dropzone === undefined) {
                console.log('error: could not find dropzone vue component!')
                return;
            }

            vm.images_all.forEach(function(i) {
                var fileUrl = '/api/image/' + i.guid;
                axios.get(fileUrl).then(function(response) {
                    //console.log(response.headers["x-clinica-custom-data"]);
                    dropzone.manuallyAddFile({ id: response.headers["x-file-guid"], fileName: response.headers["content-disposition"].split("; ")[1], size: response.data.length }, fileUrl);
                    i.caption = response.headers["x-clinica-custom-data"]["caption"];
                    i.description = i.caption = response.headers["x-clinica-custom-data"]["description"];
                });
            });

        },
        template: function() {
            var vm = this;
            return `
                  <div class="dz-preview dz-file-preview">
                    <div>
                      <div class="dz-image" style="width:` + vm.width + `; height:` + vm.height + `;">
                          <img class="dz-image-img" data-dz-thumbnail /></div>
                      <div class="dz-details">
                        <div class="dz-size"><span data-dz-size></span></div>
                        <div class="dz-filename"><span data-dz-name></span></div>
                      </div>
                      <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                      <div class="dz-error-message"><span data-dz-errormessage></span></div>
                      <div class="dz-success-mark"><i class="fa fa-check"></i></div>
                      <div class="dz-error-mark"><i class="fa fa-close"></i></div>
                    </div>                  
                  <div class="p-q" style="width:` + vm.width + `!important;"><input width="100%" type="text" placeholder="Add Caption" id="caption" class="dz-image-caption"></div>
                  <div class="p-q" style="width:` + vm.width + `;!important"><input width="100%" type="text" placeholder="Add Description" id="description" class="dz-image-description"></div>
                </div>
              `;
        }

    }
};