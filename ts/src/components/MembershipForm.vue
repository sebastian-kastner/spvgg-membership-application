<template>
  <div class="form-container">
    <form action="/action_page.php">
      <div class="row header-row">Wer soll Mitglied werden?</div>
      <div class="row">
        <div class="form-input">
          <input type="radio" id="new_member_self" value="self" v-model="new_nember" />
          <label for="new_member_self">Ich möchte Mitglied werden</label>
        </div>
        <div class="form-input">
          <input type="radio" id="new_member_other" value="other" v-model="new_nember" />
          <label for="new_member_other"
            >Ich möchte die Mitgliedschaft für eine andere Person beantragen</label
          >
        </div>
      </div>
      <div class="row header-row">Ab wann willst Du als Mitglied aufgenommen werden?</div>
      <div class="row">
        <div class="form-input">
          <input
            type="radio"
            id="membership_start_now"
            :value="membership_start_types.now"
            v-model="membership_start"
          />
          <label for="membership_start_now">Nächstmöglicher Zeitpunkt</label>
        </div>
        <div class="text-input">
          <input
            type="radio"
            id="membership_start_from"
            :value="membership_start_types.from"
            v-model="membership_start"
          />
          <label for="membership_start_from" style="align-self: center">Ab dem...</label>
          <span>
            <datepicker
              v-model="membership_start_date"
              :lowerLimit="new Date()"
              :locale="locale"
              inputFormat="dd.MM.yyyy"
              :clearable="false"
              :disabled="membership_start !== membership_start_types.from"
            />
          </span>
        </div>
      </div>
      <div class="row header-row">Welche Art von Mitgliedschaft willst du beantragen?</div>
      <div class="row">
        <div class="form-input">
          <input
            type="radio"
            id="membership_type_family"
            value="family"
            v-model="membership_type"
          />
          <label for="membership_type_family">Familienmitgliedschaft</label>
        </div>
        <div class="form-input">
          <input
            type="radio"
            id="membership_type_single"
            value="single"
            v-model="membership_type"
          />
          <label for="membership_type_single">Einzelmitgliedschaft</label>
        </div>
      </div>
      <div class="row header-row">
        In welcher Abteilung möchtest Du/Ihr Mitglied sein? (Mehrfachauswahl möglich)
      </div>
      <div class="row">
        <div class="col-50">
          <div class="form-input">
            <input
              id="section_football"
              type="checkbox"
              v-model="sections.football"
              true-value="yes"
              false-value="no"
            />
            <label for="section_football">Fußball</label>
          </div>

          <div class="form-input">
            <input
              id="section_bowling"
              type="checkbox"
              v-model="sections.bowling"
              true-value="yes"
              false-value="no"
            />
            <label for="section_bowling">Kegeln</label>
          </div>
        </div>

        <div class="col-50">
          <div class="form-input">
            <input
              id="section_theatre"
              type="checkbox"
              v-model="sections.theatre"
              true-value="yes"
              false-value="no"
            />
            <label for="section_theatre">Theater</label>
          </div>

          <div class="form-input">
            <input
              id="section_fitness"
              type="checkbox"
              v-model="sections.fitness"
              true-value="yes"
              false-value="no"
            />
            <label for="section_fitness">Fitness &amp; Freizeit</label>
          </div>
        </div>
      </div>
      <div class="row header-row">Hier kannst du Deine/Eure Mitgliederdaten eintragen</div>
      <person-list :people="people" :isFamily="membership_type === 'family'" />
      <div class="row header-row">Kontodaten</div>
      <div class="row">
        <div class="text-input">
          <label for="bic">BIC:</label>
          <input type="text" id="bic" v-model="bic" />
        </div>
      </div>
      <div class="row">
        <div class="text-input">
          <label for="bic">IBAN:</label>
          <input type="text" id="iban" v-model="iban" />
        </div>
      </div>
      <div class="row">
        <div class="text-input">
          <label for="bankName">Kreditinstitut:</label>
          <input type="text" id="bankName" v-model="bankName" />
        </div>
      </div>
      <div class="row">
        <div class="text-input">
          <label for="accountOwner">Kontoinhaber:</label>
          <input type="text" id="bic" v-model="accountOwner" />
        </div>
      </div>
      <div class="row header-row">Einverständniserklärung</div>
      <div class="row">
        <div class="labelled-checkbox">
          <input type="checkbox" id="sepaAgreement" v-model="sepaAgreement" />
          <label for="sepaAgreement">
            SEPA-Lastschriftenmandat Hiermit ermächtige/n ich/wir Sie, die Beitragsgebühren von
            meinem /unserem Konto mittels Lastschrift einzuziehen. Zugleich weise/n ich/wir
            mein/unser Kreditinstitut an, die SpVgg Deuringen e.V. auf mein/unser Konto gezogene
            Lastschriften einzulösen. Hinweis: ich kann/wir können innerhalb von acht Wochen,
            beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrags verlangen. Es
            gelten dabei die mit meinem/unserem Kreditinstitut vereinbarten Bedingungen.
          </label>
        </div>
      </div>
      <div class="row">
        <div class="labelled-checkbox">
          <input type="checkbox" id="dataProtectionAgreement" v-model="dataProtectionAgreement" />
          <label for="dataProtectionAgreement">
            Datenschutzerklärung Ich willige ein, dass die SpVgg Deuringen, als verantwortliche
            Stelle, die in der Beitrittserklärung erhobenen personenbezogenen Daten, wie Namen,
            Vorname, Geburtsdatum, Adresse, E-Mail-Adresse, Telefonnummer und Bankverbindung
            ausschließlich zum Zwecke der Mitgliederverwaltung, des Beitragseinzuges und der
            Übermittlung von Vereinsinformationen durch den Verein verarbeitet und genutzt werden.
            Eine Übermittlung von Teilen dieser Daten an die jeweiligen Sportfachverbände und den
            Bayerischen Landes Sportverband e.V. (BLSV) findet nur im Rahmen der in den Satzungen
            der Fachverbände bzw. des BLSV festgelegten Zwecke statt. Diese Datenübermittlungen sind
            notwendig zum Zweck der Mitgliederverwaltung, zum Zwecke der Organisation eines Spiel-
            bzw. Wettkampfbetriebes und zum Zwecke der Einwerbung von öffentlichen Fördermitteln.
            Eine Datenübermittlung an Dritte, außerhalb der Fachverbände und des BLSV, findet nicht
            statt. Eine Datennutzung für Werbezwecke findet ebenfalls nicht statt. Bei Beendigung
            der Mitgliedschaft werden die personenbezogenen Daten gelöscht, soweit sie nicht
            entsprechend der steuerrechtlichen Vorgaben aufbewahrt werden müssen. Neben dem Recht
            auf Auskunft bezüglich der zu seiner Person bei der verantwortlichen SpVgg Deuringen
            gespeicherten Daten hat jedes Mitglied, im Rahmen der Vorgaben der DSGVO, das Recht, der
            Speicherung der Daten, die nicht im Rahmen der gesetzlichen Vorgaben für bestimmte
            Zeiträume vorgehalten werden müssen, für die Zukunft zu widersprechen. Ferner hat das
            Mitglied, im Falle von fehlerhaften Daten, ein Korrekturrecht
          </label>
        </div>
      </div>
      <div class="row">
        <div class="labelled-checkbox">
          <input type="checkbox" id="publicationAgreement" v-model="publicationAgreement" />
          <label for="publicationAgreement">
            Weiter willige ich ein, dass die SpVgg Deuringen von sportbezogenen oder
            gesellschaftlichen Veranstaltungen auf der Website des Vereines oder sonstigen
            Vereinspublikationen veröffentlicht und an die Presse zum Zwecke der Veröffentlichung
            ohne spezielle Einwilligung weitergibt. Abbildungen von genannten Einzelpersonen oder
            Klein-Gruppen hingegen bedürfen einer Einwilligung der abgebildeten Personen.
          </label>
        </div>
      </div>
      <div class="row">
        <input type="submit" value="Submit" />
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator'
import Datepicker from 'vue3-datepicker'
import { de } from 'date-fns/locale'
import PersonList from './PersonList.vue'
import type { Person } from '../types'

@Component({
  components: { Datepicker, PersonList }
})
export default class MembershipForm extends Vue {
  membership_start_types = {
    now: 'now',
    from: 'from'
  }

  new_nember = ''
  membership_start = ''
  membership_start_date = new Date()
  membership_type = ''

  locale = de

  bic = ''
  iban = ''
  bankName = ''
  accountOwner = ''

  sepaAgreement = false
  dataProtectionAgreement = false
  publicationAgreement = false

  people: Person[] = [
    {
      firstName: 'Franz',
      isStudent: false
    }
  ]

  sections = {
    football: false,
    bowling: false,
    theatre: false,
    fitness: false
  }
}
</script>

<style lang="scss" scoped>
.labelled-checkbox {
  display: flex;
  margin-left: 20px;
  align-items: flex-start;
  margin-top: 20px;

  input {
    margin-right: 10px;
    align-self: top;
  }

  label {
    text-align: justify;
  }
}
</style>
