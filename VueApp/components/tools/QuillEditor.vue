<template>
    <div class="quill-editor">
        <slot name="toolbar"></slot>
        <div ref="editor"></div>
    </div>
</template>
<script src="./QuillEditor.vue.js"></script>
<style>
    .quill-editor img {
        max-width: 100%;
    }
</style>