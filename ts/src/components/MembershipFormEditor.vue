<template>
  <div class="modal" v-if="showFeesStatute" @click.self="toggleFeesStatue">
    <fees-statute class="modal-content" @close="toggleFeesStatue" />
  </div>

  <div class="membership-container">
    <div class="membership-wrapper">
      <div class="download-application">
        <span>Formular Herunterladen und Ausdrucken statt online Ausfüllen?</span>
        <div class="row">
          <a
            href="https://www.spvggdeuringen.de/mitgliedwerden/Aufnahmeantrag_SpVggDeuringen.pdf"
            target="_blank"
          >
            <input type="button" class="primary-btn" value="Antrag herunterladen" />
          </a>
        </div>
      </div>

      <div class="required-fields-hint smaller">
        Mit * markierte Felder müssen ausgefüllt werden
      </div>

      <!-- MEMBERSHIP START DATE -->
      <div class="row header-row">Ab wann möchtest Du als Mitglied aufgenommen werden? *</div>
      <div
        class="row"
        :class="{ invalid: !isFieldSet(application.membership_start, 'membershipStart') }"
      >
        <div class="form-input labeled-radio">
          <input
            type="radio"
            id="membership_start_now"
            :value="MembershipStartTypes.NOW"
            v-model="application.membership_start"
          />
          <label for="membership_start_now">Nächstmöglicher Zeitpunkt</label>
        </div>
        <div class="text-input labeled-radio">
          <div class="d-flex d-flex-wrap">
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
      </div>
      <!-- MEMBERSHIP TYPE -->
      <div class="row header-row">Welche Art von Mitgliedschaft möchtest du beantragen? *</div>
      <div
        class="row"
        :class="{ invalid: !isFieldSet(application.membership_type, 'membershipType') }"
      >
        <div class="form-input labeled-radio">
          <input
            type="radio"
            id="membership_type_family"
            :value="MembershipTypes.FAMILY"
            v-model="application.membership_type"
          />
          <label for="membership_type_family">Familienmitgliedschaft</label>
        </div>
        <div class="form-input labeled-radio">
          <input
            type="radio"
            id="membership_type_single"
            :value="MembershipTypes.SINGLE"
            v-model="application.membership_type"
          />
          <label for="membership_type_single">Einzelmitgliedschaft</label>
        </div>
      </div>
      <!-- MEMBERSHIP PEOPLE -->
      <div class="row header-row">Hier kannst du Deine/Eure Mitgliederdaten eintragen</div>
      <div v-if="tooManyAdults" class="row invalid">
        Bei einer Familienmitgliedschaft sind maximal zwei Erwachsene Personen möglich.
      </div>
      <member-list-editor
        :members="application.members"
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
      <div
        class="row"
        :class="{ invalid: !isFieldSet(application.bankAccountOwner, 'bankAccountOwner') }"
      >
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
            * SEPA-Lastschriftenmandat <br />
            <span class="smaller">
              Hiermit ermächtige/n ich/wir Sie, die Beitragsgebühren von meinem /unserem Konto
              mittels Lastschrift einzuziehen. Zugleich weise/n ich/wir mein/unser Kreditinstitut
              an, die SpVgg Deuringen e.V. auf mein/unser Konto gezogene Lastschriften einzulösen.
              Hinweis: ich kann/wir können innerhalb von acht Wochen, beginnend mit dem
              Belastungsdatum, die Erstattung des belasteten Betrags verlangen. Es gelten dabei die
              mit meinem/unserem Kreditinstitut vereinbarten Bedingungen.
            </span>
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
            * Datenschutzerklärung <br />
            <span class="smaller">
              Ich willige ein, dass die SpVgg Deuringen, als verantwortliche Stelle, die in der
              Beitrittserklärung erhobenen personenbezogenen Daten, wie Namen, Vorname,
              Geburtsdatum, Adresse, E-Mail-Adresse, Telefonnummer und Bankverbindung ausschließlich
              zum Zwecke der Mitgliederverwaltung, des Beitragseinzuges und der Übermittlung von
              Vereinsinformationen durch den Verein verarbeitet und genutzt werden. Eine
              Übermittlung von Teilen dieser Daten an die jeweiligen Sportfachverbände und den
              Bayerischen Landes Sportverband e.V. (BLSV) findet nur im Rahmen der in den Satzungen
              der Fachverbände bzw. des BLSV festgelegten Zwecke statt. Diese Datenübermittlungen
              sind notwendig zum Zweck der Mitgliederverwaltung, zum Zwecke der Organisation eines
              Spiel- bzw. Wettkampfbetriebes und zum Zwecke der Einwerbung von öffentlichen
              Fördermitteln. Eine Datenübermittlung an Dritte, außerhalb der Fachverbände und des
              BLSV, findet nicht statt. Eine Datennutzung für Werbezwecke findet ebenfalls nicht
              statt. Bei Beendigung der Mitgliedschaft werden die personenbezogenen Daten gelöscht,
              soweit sie nicht entsprechend der steuerrechtlichen Vorgaben aufbewahrt werden müssen.
              Neben dem Recht auf Auskunft bezüglich der zu seiner Person bei der verantwortlichen
              SpVgg Deuringen gespeicherten Daten hat jedes Mitglied, im Rahmen der Vorgaben der
              DSGVO, das Recht, der Speicherung der Daten, die nicht im Rahmen der gesetzlichen
              Vorgaben für bestimmte Zeiträume vorgehalten werden müssen, für die Zukunft zu
              widersprechen. Ferner hat das Mitglied, im Falle von fehlerhaften Daten, ein
              Korrekturrecht
            </span>
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
            <span class="smaller">
              * Weiter willige ich ein, dass die SpVgg Deuringen von sportbezogenen oder
              gesellschaftlichen Veranstaltungen auf der Website des Vereines oder sonstigen
              Vereinspublikationen veröffentlicht und an die Presse zum Zwecke der Veröffentlichung
              ohne spezielle Einwilligung weitergibt. Abbildungen von genannten Einzelpersonen oder
              Klein-Gruppen hingegen bedürfen einer Einwilligung der abgebildeten Personen.
            </span>
          </label>
        </div>
      </div>
      <div
        class="row invalid"
        id="issue-marker"
        :class="{ hidden: !hasValidationIssues, truffleShuffle: truffleShuffle }"
      >
        Rot hinterlegte Validierungsfehler müssen behoben werden um das Formular abzuschicken
      </div>
      <div class="row">
        <input type="button" class="primary-btn" value="Weiter" @click="doSubmit" />
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="footer-wrapper">
      <div>
        <input
          type="button"
          class="primary-btn"
          value="Beitragssatzung"
          @click="toggleFeesStatue"
        />
      </div>
      <div class="membership-fee-summary">
        <div>
          <b>Jahresbeitrag*:</b>
          <span class="membership-fee" v-if="membershipFee">{{ membershipFee }}€</span>
          <span class="membership-fee" v-else>--</span>
        </div>
        <div class="smaller">* vorraussichtlicher Betrag</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-facing-decorator'
import Datepicker from 'vue3-datepicker'
import { de } from 'date-fns/locale'
import MemberListEditor from './MemberListEditor.vue'
import FeesStatute from './FeesStatute.vue'
import { MembershipStartTypes, MembershipTypes, Checked } from '../types'
import { validateField } from '../utils/fieldValidator'
import { MembershipSummarizer } from '../utils/summaryUtils'
import type { Application, ValidationIssues, AppMode } from '../types'

@Component({
  components: { Datepicker, MemberListEditor, FeesStatute }
})
export default class MembershipFormEditor extends Vue {
  @Prop({ required: true }) appMode!: AppMode
  @Prop({ required: true }) application!: Application

  MembershipStartTypes = MembershipStartTypes
  MembershipTypes = MembershipTypes
  Checked = Checked
  missingRequiredFields = false
  showFeesStatute = false
  locale = de
  truffleShuffle = false
  membershipFee: number | null = null
  numberOfAdults: number = 0;
  validationActive = false
  validationIssues: ValidationIssues = {
    issues: new Set()
  }

  mounted(): void {
    this.applicationWatcher();
    // DIRTY, DIRTY, DIRTY!!!!
    if (this.membershipFee) {
      this.validationActive = true;
    }
  }

  @Watch('application', { deep: true })
  public applicationWatcher(): void {
    const summary = new MembershipSummarizer(this.application).summarize();
    
    const fee = summary.membershipFee

    this.numberOfAdults = summary.numberOfAdults
    this.membershipFee = fee
  }

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

    if (!issuesAfter) {
      this.appMode.isEditMode = false
    }
  }

  async initValidation(): Promise<void> {
    this.validationActive = true
    await this.$nextTick()
  }

  isFieldSet(value: any, key: string): boolean {
    return validateField(this.validationActive, value, key, this.validationIssues.issues)
  }

  toggleFeesStatue(): void {
    this.showFeesStatute = !this.showFeesStatute
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

  get tooManyAdults(): boolean {
    const validationKey = "tooManyAdults";
    if (this.application.membership_type && this.application.membership_type === MembershipTypes.FAMILY) {
      this.validationIssues.issues.add(validationKey)
      return this.numberOfAdults > 2;
    }
    this.validationIssues.issues.delete(validationKey)
    return false;
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
@import '../assets/variables.scss';

.labeled-checkbox {
  display: flex;
  align-items: flex-start;
  margin-top: 20px;

  input {
    margin-right: 10px;
    margin-top: 5px;
  }
}

.labeled-radio {
  display: flex;
  align-items: center;

  input {
    margin-right: 10px;
  }
}

.required-fields-hint {
  width: 100%;
  text-align: right;
}

.download-application {
  width: 100%;
  text-align: right;
  border-bottom: 1px solid darkgray;
  padding-bottom: 20px;
  margin-bottom: 10px;

  input {
    margin-top: 10px;
    margin-right: 0;
  }
}

.modal {
  position: fixed; /* Stay in place */
  z-index: 1; /* Sit on top */
  padding-top: 100px; /* Location of the box */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
}

/* Modal Content */
.modal-content {
  background-color: #fefefe;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  margin-bottom: 40px;
}

@media screen and (max-width: $medium-screen) {
  .download-application {
    text-align: center;

    .row {
      display: flex;
      justify-content: center;
    }
  }

  .modal-content {
    width: 95%;
  }
}

@media screen and (max-width: 900px) {
  .modal-content {
    min-width: 90%;
  }
}

#issue-marker {
  margin-top: 10px;
  padding: 5px;
  text-align: center;
}

.truffleShuffle {
  animation: shake 0.7s ease-in-out infinite;
}

.footer {
  position: fixed;
  height: $footer-height;
  bottom: 0;
  width: 100%;
  background-color: darken(#f2f2f2, 3%);
  padding: 20px 0;

  @media screen and (max-width: $small-screen) {
    padding: 10px 0;
  }
}

.footer-wrapper {
  width: 80%;
  max-width: 750px;
  margin: auto;
  display: flex;
  justify-content: space-between;

  .primary-btn {
    float: none !important;
  }

  .membership-fee-summary {
    height: 44px;
    display: grid;
  }

  .membership-fee {
    margin-left: 10px;
    background-color: lightblue;
    padding: 1px;
    min-width: 40px;
    display: inline-block;
    text-align: center;
  }

  @media screen and (max-width: $small-screen) {
    flex-direction: column-reverse;
    justify-content: center;
    align-items: center;

    .primary-btn {
      padding: 6px 10px !important;
    }

    .membership-fee-summary {
      height: 36px;
    }
  }
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
../utils/summaryUtils