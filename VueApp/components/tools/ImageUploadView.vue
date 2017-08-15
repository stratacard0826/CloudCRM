<template>
    <section class="card imageUploadView">
        <div v-if="!hide_header" class="card-header card-header-primary">
            Images
        </div>
        <div class="card-block">
            <div class="row m-0 p-0" v-if="read_only">
                <ul>
                    <li v-show="images_all.length > 0" v-for="image in images_all">
                        <figure>
                            <div>
                                <img :src="'/api/image/' + image.guid" v-on:click="openImage(image.guid, '')" />
                            </div>
                        </figure>
                        <h4>{{image.caption}}</h4>
                        <p>{{image.description}}</p>
                    </li>
                </ul>
                <div v-show="images_all.length < 1" class="col-auto p-q font-lg font-weight-bold">No Images Available</div>
            </div>
            <Dropzone v-else
                      :ref="'dropzone'+relationship_guid"
                      :id="'dropzone'+relationship_guid"
                      :url="'/api/Image/GeneralImageUpload/' + relationship_type + '/' + relationship_guid"
                      v-on:vdropzone-success="imageUploadSuccess"
                      v-on:vdropzone-file-added="imageAdded"
                      v-on:vdropzone-removed-file="imageRemoved"
                      :use-font-awesome="true"
                      v-bind:preview-template="template">
                <!-- Optional parameters if any! -->
                <input type="hidden" name="token" value="xxx">
            </Dropzone>
        </div>
    </section>
</template>

<script src="./ImageUploadView.vue.js"></script>
