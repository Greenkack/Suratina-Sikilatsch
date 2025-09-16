<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-6">
          <v-icon color="hp" size="large" class="mr-3">
            mdi-heat-pump
          </v-icon>
          Wärmepumpen-Angebote
        </h1>
      </v-col>
    </v-row>

    <v-alert type="info" class="mb-6">
      Diese Seite ist in Entwicklung. Hier werden spezielle Wärmepumpen-Funktionen implementiert.
    </v-alert>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Wärmepumpen-Konfiguration</v-card-title>
          <v-card-text>
            <p>Spezielle Funktionen für Wärmepumpen-Angebote:</p>
            <ul>
              <li>HP-spezifische Berechnungen</li>
              <li>COP-Wert Optimierung</li>
              <li>Heizkurven-Analyse</li>
              <li>JAZ-Berechnung</li>
              <li>Kombinierte PV+HP Systeme</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// Heatpump page implementation will go here
</script>