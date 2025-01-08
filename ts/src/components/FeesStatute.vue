<template>
  <div class="fees-statute">
    <span class="close" @click="close">&times;</span>
    <div>
      <h3>Beitragssatzung</h3>
      <ol>
        <li>
          Alle Vereinsmitglieder zahlen einen Mitgliedsbeitrag. Der Mitgliedsbeitrag wird jährlich
          erhoben. Eine rückwirkende Erhöhung der Beiträge ist ausgeschlossen. Ehrenmitglieder sind
          von der Beitragszahlung befreit
        </li>
        <li>
          Die Beiträge werden jeweils jährlich zum ersten Werktag nach dem 1. Februar eingezogen.
          Das Mitglied erteilt dem Verein hierfür ein SEPA-Lastschriftmandat.
        </li>
      </ol>

      <h4>Der jährliche Beitrag beträgt</h4>
      <div>
        <ol class="alpha-list">
          <li>
            <fee-details
              label="Erwachsene (ab dem vollendeten 18. Lebensjahr) *"
              :fee="fees.INDIVIDUAL_ADULT_FEE"
            />
          </li>
          <li>
            <fee-details
              label="Ehepaare, eingetragene Lebensgemeinschaften *"
              :fee="fees.FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE"
            />
          </li>
          <li>
            <fee-details
              label="Kinder, Jugendliche, Schüler und Studenten **"
              :fee="fees.INDIVIDUAL_STUDENT_FEE"
            />
          </li>
          <li class="no-list" style="margin-top: 10px;">
            <span class="bold">*</span> a und b können zu einem Familienbeitrag erweitert werden. Dabei sind für das erste und
            zweite Kind jeweils 25,00 € zusätzlich zu entrichten. Weitere Kinder sind beitragsfrei.
          </li>
          <li class="no-list">
            <span class="bold">**</span>
            bei volljährigen Mitgliedern ist jährlich ein Ausbildungsnachweis vorzulegen.
          </li>
        </ol>
      </div>

      <h4>Abteilungsbeitrag:</h4>
      <div>
        <ul class="no-list">
          <li>
            <fee-details label="Fußball" :fee="fees.SECTION_FEES.football" />
          </li>
          <li>
            <fee-details label="Kegeln" :fee="fees.SECTION_FEES.bowling" />
          </li>
          <li>
            <fee-details label="Theater" :fee="fees.SECTION_FEES.theatre" />
          </li>
          <li>
            <fee-details label="Fitness & Freizeit" :fee="fees.SECTION_FEES.fitness" />
          </li>
        </ul>
      </div>

      <ol start="3">
        <li>
          Bei unterjährigem Vereinseintritt betragen die Beiträge 1/12 pro Monat im laufenden Jahr
        </li>
        <li>
          Alle aktiven Mitglieder ab dem vollendeten 16. Lebensjahr und bis zum vollendeten 60.
          Lebensjahr <b>müssen jährlich 2 Stunden Arbeit</b> zum Erhalt und / oder zur Pflege der
          vereinseigenen Einrichtungen und Anlagen erbringen. Wird die Anzahl der Arbeitsstunden
          nicht erfüllt, erhebt der Verein pro nicht geleisteter Stunde 10,00 €. Der eventuell
          fällig werdende Betrag wird per Lastschrifteinzug im Monat abgebucht, der auf den Monat
          folgt, in dem das Mitglied über die Abrechnung der Stunden informiert wurde
        </li>
        <li>
          Beendigung der Mitgliedschaft
          <ol>
            <li>Die Mitgliedschaft erlischt durch Austritt, Ausschluss oder Tod.</li>
            <li>
              Der Austritt aus dem Verein ist dem Mitglied nur zum Jahresende möglich und hat
              schriftlich unter Einhaltung einer Frist von 1 Monat bei der Geschäftsstelle zu
              erfolgen.
            </li>
          </ol>
        </li>
        <li>
          Diese Beitragsordnung kann bei Notwendigkeit vom Vorstand per Beschluss geändert werden.
          Der Vorstand muss die Änderungsbeschlüsse, bezüglich dieser Ordnung in der nächsten
          Mitgliederversammlung bekannt geben, damit treten die Änderungen in Kraft.
        </li>
      </ol>
    </div>
    <div class="button-container">
      <input type="button" class="secondary-btn" value="Schließen" @click="close" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import * as fees from '../utils/summaryUtils'
import FeeDetails from './FeeDetails.vue'

@Component({
  components: { FeeDetails },
  emits: ['close']
})
export default class FeesStatute extends Vue {
  fees = fees

  close(): void {
    this.$emit('close')
  }
}
</script>

<style lang="scss" scoped>
.fees-statute {
  line-height: 1.3;
  max-width: 750px;
}

li {
  padding-top: 5px;
  margin-left: 7px;
  padding-left: 7px;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 40px;
  font-weight: bold;
}

.bold {
  font-weight: bold;
}

.alpha-list {
  list-style-type: lower-alpha;
}

.no-list {
  list-style: none;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.button-container {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
../utils/summaryUtils
