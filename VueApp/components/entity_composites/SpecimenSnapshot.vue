<template>
    <header class="specimenSnapshot">
        <h1>
            Specimen {{specimenId}}<br />
            {{specimen.type.type}} - {{specimen.transport.name}}
        </h1>
        <small>
            Samples Received on {{specimen.createdDate | localeDate}}<br />
            Institution: {{client.name}} | Received at: {{lab.name}}
        </small>
    </header>    
</template>

<script src="./SpecimenSnapshot.vue.js"></script>