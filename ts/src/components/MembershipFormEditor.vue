<template>
  <div class="form-container">
    <div class="membership-form">
      <div class="required-fields-hint">Mit * markierte Felder müssen ausgefüllt werden</div>
      <!-- MEMBERSHIP OWNER -->
      <div class="row header-row">Wer soll Mitglied werden? *</div>
      <div
        class="row"
        :class="{ invalid: !isFieldSet(application.membership_owner, 'membershipOwner') }"
      >
        <div class="form-input">
          <input
            type="radio"
            id="new_member_self"
            :value="MembershipOwnerTypes.SELF"
            v-model="application.membership_owner"
          />
          <label for="new_member_self">Ich möchte Mitglied werden</label>
        </div>
        <div class="form-input">
          <input
            type="radio"
            id="new_member_other"
            :value="MembershipOwnerTypes.OTHER"
            v-model="application.membership_owner"
          />
          <label for="new_member_other"
            >Ich möchte die Mitgliedschaft für eine andere Person beantragen</label
          >
        </div>
      </div>
      <!-- MEMBERSHIP START DATE -->
      <div class="row header-row">Ab wann möchtest Du als Mitglied aufgenommen werden? *</div>
      <div
        class="row"
        :class="{ invalid: !isFieldSet(application.membership_start, 'membershipStart') }"
      >
        <div class="form-input">
          <input
            type="radio"
            id="membership_start_now"
            :value="MembershipStartTypes.NOW"
            v-model="application.membership_start"
          />
          <label for="membership_start_now">Nächstmöglicher Zeitpunkt</label>
        </div>
        <div class="text-input">
          <input
            type="radio"
            id="membership_start_from"
            :value="MembershipStartTypes.FROM"
            v-model="application.membership_start"
          />
          <label for="membership_start_from">Ab dem...</label>
          <span>
            <datepicker
              v-model="application.membership_start_date"
              :lowerLimit="new Date()"
              :locale="locale"
              inputFormat="dd.MM.yyyy"
              :clearable="false"
              :disabled="application.membership_start !== MembershipStartTypes.FROM"
            />
          </span>
        </div>
      </div>
      <!-- MEMBERSHIP TYPE -->
      <div class="row header-row">Welche Art von Mitgliedschaft möchtest du beantragen? *</div>
      <div
        class="row"
        :class="{ invalid: !isFieldSet(application.membership_type, 'membershipType') }"
      >
        <div class="form-input">
          <input
            type="radio"
            id="membership_type_family"
            :value="MembershipTypes.FAMILY"
            v-model="application.membership_type"
          />
          <label for="membership_type_family">Familienmitgliedschaft</label>
        </div>
        <div class="form-input">
          <input
            type="radio"
            id="membership_type_single"
            :value="MembershipTypes.SINGLE"
            v-model="application.membership_type"
          />
          <label for="membership_type_single">Einzelmitgliedschaft</label>
        </div>
      </div>
      <!-- MEMBERSHIP SECTIONS -->
      <div class="row header-row">
        In welcher Abteilung möchtest Du/Ihr Mitglied sein? (Mehrfachauswahl möglich) *
      </div>
      <div class="row" :class="{ invalid: !isSectionSet() }">
        <div class="col-50">
          <div class="form-input">
            <input
              id="section_football"
              type="checkbox"
              v-model="application.sections.football"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label for="section_football">Fußball</label>
          </div>
          <div class="form-input">
            <input
              id="section_bowling"
              type="checkbox"
              v-model="application.sections.bowling"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label for="section_bowling">Kegeln</label>
          </div>
        </div>
        <div class="col-50">
          <div class="form-input">
            <input
              id="section_theatre"
              type="checkbox"
              v-model="application.sections.theatre"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label for="section_theatre">Theater</label>
          </div>
          <div class="form-input">
            <input
              id="section_fitness"
              type="checkbox"
              v-model="application.sections.fitness"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label for="section_fitness">Fitness &amp; Freizeit</label>
          </div>
        </div>
      </div>
      <!-- MEMBERSHIP PEOPLE -->
      <div class="row header-row">Hier kannst du Deine/Eure Mitgliederdaten eintragen</div>
      <person-list-editor
        :people="application.people"
        :isFamily="application.membership_type === MembershipTypes.FAMILY"
        :validationActive="validationActive"
        :validationIssues="validationIssues"
      />
      <div class="row header-row">Kontodaten</div>
      <!-- IBAN -->
      <div class="row" :class="{ invalid: !isFieldSet(application.iban, 'iban') }">
        <div class="text-input">
          <label for="bic">IBAN: *</label>
          <input type="text" id="iban" v-model="application.iban" />
        </div>
      </div>
      <!-- BIC -->
      <div class="row" :class="{ invalid: !isFieldSet(application.bic, 'bic') }">
        <div class="text-input">
          <label for="bic">BIC: *</label>
          <input type="text" id="bic" v-model="application.bic" />
        </div>
      </div>
      <!-- BANK NAME -->
      <div class="row" :class="{ invalid: !isFieldSet(application.bankName, 'bankName') }">
        <div class="text-input">
          <label for="bankName">Kreditinstitut: *</label>
          <input type="text" id="bankName" v-model="application.bankName" />
        </div>
      </div>
      <!-- ACCOUNT OWNER -->
      <div class="row" :class="{ invalid: !isFieldSet(application.bankAccountOwner, 'bankAccountOwner') }">
        <div class="text-input">
          <label for="bankAccountOwner">Kontoinhaber: *</label>
          <input type="text" id="bic" v-model="application.bankAccountOwner" />
        </div>
      </div>
      <!-- AGREEMENTS -->
      <div class="row header-row">Einverständniserklärung</div>
      <!-- SEPA -->
      <div class="row" :class="{ invalid: !isChecked('sepaAgreement', application.sepaAgreement) }">
        <div class="labeled-checkbox">
          <input
            type="checkbox"
            id="sepaAgreement"
            v-model="application.sepaAgreement"
            :true-value="Checked.YES"
            :false-value="Checked.NO"
          />
          <label for="sepaAgreement">
            * SEPA-Lastschriftenmandat Hiermit ermächtige/n ich/wir Sie, die Beitragsgebühren von
            meinem /unserem Konto mittels Lastschrift einzuziehen. Zugleich weise/n ich/wir
            mein/unser Kreditinstitut an, die SpVgg Deuringen e.V. auf mein/unser Konto gezogene
            Lastschriften einzulösen. Hinweis: ich kann/wir können innerhalb von acht Wochen,
            beginnend mit dem Belastungsdatum, die Erstattung des belasteten Betrags verlangen. Es
            gelten dabei die mit meinem/unserem Kreditinstitut vereinbarten Bedingungen.
          </label>
        </div>
      </div>
      <!-- DATA PROTECTION -->
      <div
        class="row"
        :class="{
          invalid: !isChecked('dataProtectionAgreement', application.dataProtectionAgreement)
        }"
      >
        <div class="labeled-checkbox">
          <input
            type="checkbox"
            id="dataProtectionAgreement"
            v-model="application.dataProtectionAgreement"
            :true-value="Checked.YES"
            :false-value="Checked.NO"
          />
          <label for="dataProtectionAgreement">
            * Datenschutzerklärung Ich willige ein, dass die SpVgg Deuringen, als verantwortliche
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
      <!-- PUBLICATION -->
      <div
        class="row"
        :class="{ invalid: !isChecked('publicationAgreement', application.publicationAgreement) }"
      >
        <div class="labeled-checkbox">
          <input
            type="checkbox"
            id="publicationAgreement"
            v-model="application.publicationAgreement"
            :true-value="Checked.YES"
            :false-value="Checked.NO"
          />
          <label for="publicationAgreement">
            * Weiter willige ich ein, dass die SpVgg Deuringen von sportbezogenen oder
            gesellschaftlichen Veranstaltungen auf der Website des Vereines oder sonstigen
            Vereinspublikationen veröffentlicht und an die Presse zum Zwecke der Veröffentlichung
            ohne spezielle Einwilligung weitergibt. Abbildungen von genannten Einzelpersonen oder
            Klein-Gruppen hingegen bedürfen einer Einwilligung der abgebildeten Personen.
          </label>
        </div>
      </div>
      <div class="row">
        <input type="submit" value="Weiter" @click="doSubmit" />
      </div>
      <div
        class="row invalid"
        id="issue-marker"
        :class="{ hidden: !hasValidationIssues, truffleShuffle: truffleShuffle }"
      >
        Rot hinterlegte Validierungsfehler müssen behoben werden um das Formular abzuschicken
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import Datepicker from 'vue3-datepicker'
import { de } from 'date-fns/locale'
import PersonListEditor from './PersonListEditor.vue'
import { MembershipOwnerTypes, MembershipStartTypes, MembershipTypes, Checked } from '../types'
import { validateField } from '../fieldValidator'
import type { Application, ValidationIssues, AppMode } from '../types'
import { printIssues } from '../devUtils'

@Component({
  components: { Datepicker, PersonListEditor }
})
export default class MembershipFormEditor extends Vue {
  @Prop({ required: true }) appMode!: AppMode
  @Prop({ required: true }) application!: Application;

  MembershipStartTypes = MembershipStartTypes
  MembershipTypes = MembershipTypes
  MembershipOwnerTypes = MembershipOwnerTypes
  Checked = Checked

  missingRequiredFields = false

  locale = de

  truffleShuffle = false

  validationIssues: ValidationIssues = {
    issues: new Set()
  }
  validationActive = false

  async doSubmit(): Promise<void> {
    const issuesBefore = this.hasValidationIssues
    await this.initValidation()
    const issuesAfter = this.hasValidationIssues

    // IF NEED BE, DO THE TRUFFLE SHUFFLE!!!!!11
    if (issuesBefore && issuesAfter) {
      this.truffleShuffle = true
      setTimeout(() => {
        this.truffleShuffle = false
      }, 1000)
    }

    printIssues(this.validationIssues.issues)
    console.log(this.application.bankAccountOwner);
    if (!issuesAfter) {
      this.appMode.isEditMode = false
    }
  }

  async initValidation(): Promise<void> {
    this.validationActive = true
    await this.$nextTick()
  }

  isFieldSet(value: any, key: string): boolean {
    if (key === "membershipOwner") {
        console.log("key:", key);
        console.log("value:", value);
        console.log("Account Owner: ", this.application.bankAccountOwner);
        console.log("Membership Owner: ", this.application.membership_owner);
    }

    return validateField(this.validationActive, value, key, this.validationIssues.issues)
  }

  isSectionSet(): boolean {
    const sections = this.application.sections
    // always validate to true if validation is not yet active
    if (!this.validationActive) {
      return true
    }
    const fieldKey = 'sections'
    // this is me failing with js types..
    if (
      sections.football !== Checked.YES &&
      sections.bowling !== Checked.YES &&
      sections.fitness !== Checked.YES &&
      sections.theatre !== Checked.YES
    ) {
      this.validationIssues.issues.add(fieldKey)
      return false
    }
    this.validationIssues.issues.delete(fieldKey)
    return true
  }

  isChecked(key: string, value?: Checked): boolean {
    if (!this.validationActive) {
      return true
    }
    if (value !== Checked.YES) {
      this.validationIssues.issues.add(key)
      return false
    }
    this.validationIssues.issues.delete(key)
    return true
  }

  get hasValidationIssues(): boolean {
    if (!this.validationActive) {
      return false
    }
    if (this.validationIssues.issues.size === 0 && this.validationIssues.issues.size === 0) {
      return false
    }
    return true
  }
}
</script>

<style lang="scss" scoped>
.labeled-checkbox {
  display: flex;
  margin-left: 20px;
  align-items: flex-start;
  margin-top: 20px;

  input {
    margin-right: 10px;
    margin-top: 8px;
  }

  label {
    text-align: justify;
  }
}

.required-fields-hint {
  width: 100%;
  text-align: right;
  font-size: 0.8rem;
}

#issue-marker {
  padding: 5px;
  text-align: center;
}

.truffleShuffle {
  animation: shake 0.7s ease-in-out infinite;
}

@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  50% {
    transform: translateX(3px);
  }
  75% {
    transform: translateX(-3px);
  }
  100% {
    transform: translateX(3px);
  }
}
</style>
