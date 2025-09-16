<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">
          <v-icon color="primary" size="large" class="mr-3">
            mdi-calculator
          </v-icon>
          Schnellkalkulation
        </h1>
      </v-col>
    </v-row>

    <v-alert type="info" class="mb-6">
      Diese Seite ist in Entwicklung. Hier wird die Schnellkalkulation implementiert.
    </v-alert>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Quick Calc</v-card-title>
          <v-card-text>
            <p>Schnelle Preisschätzung für PV-Anlagen:</p>
            <ul>
              <li>Vereinfachte Eingabe</li>
              <li>Sofortige Preisberechnung</li>
              <li>Grundlegende KPIs</li>
              <li>Schneller PDF-Export</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Quick calc implementation will go here
</script>