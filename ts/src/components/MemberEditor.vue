<template>
  <div>
    <div class="row" v-if="!memberIsCreator()">
      <div class="inline-button-container">
        <input
          class="secondary-btn"
          type="button"
          value="- Mitglied entfernen"
          @click="removeMember(index)"
        />
      </div>
    </div>
    <div class="row header-row">
      {{ getMemberTitle() }}
      <!-- TODO: distinguish between spouse and child here! -->
    </div>
    <div class="row" v-if="memberIsCreator()">
      <div class="info-text">
        Der Antragsteller muss volljährig sein, muss aber selbst keine Mitgliedschaft beantragen!
        Für Minderjährige muss der Antrag von einem Erziehungsberechtigten gestellt werden.
      </div>
    </div>
    <div class="row no-border">
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(member.anrede, getFieldName('anrede')) }"
      >
        <label :for="getFieldName('anrede')">Anrede: *</label>
        <select v-model="member.anrede" :id="getFieldName('anrede')">
          <option value="--">--</option>
          <option value="Herr">Herr</option>
          <option value="Frau">Frau</option>
        </select>
      </div>
      <div class="text-input col-50">
        <label :for="getFieldName('title')" class="padded-float">Titel:</label>
        <input type="text" :id="getFieldName('title')" v-model="member.title" />
      </div>
    </div>
    <div class="row" :class="{ invalid: !isFieldSet(member.firstName, getFieldName('firstName')) }">
      <div class="text-input">
        <label :for="getFieldName('firstName')">Vorname: *</label>
        <input type="text" :id="getFieldName('firstName')" v-model="member.firstName" />
      </div>
    </div>
    <div class="row" :class="{ invalid: !isFieldSet(member.lastName, getFieldName('lastName')) }">
      <div class="text-input">
        <label :for="getFieldName('lastName')">Nachname: *</label>
        <input type="text" :id="getFieldName('lastName')" v-model="member.lastName" />
      </div>
    </div>
    <div
      class="row"
      :class="{
        invalid: !isFieldSet(member.dateOfBirth, getFieldName('dateOfBirth')) || dateInvalidMessage
      }"
    >
      <div class="field-error" v-if="dateInvalidMessage">
        {{ dateInvalidMessage }}
      </div>
      <!-- TODO: validate that children are minors! -->
      <div class="text-input">
        <label :for="getFieldName('dateOfBirth')">Geburtsdatum: *</label>
        <input
          type="text"
          :id="getFieldName('dateOfBirth')"
          v-model="member.dateOfBirth"
          @input="validateDateOfBirth"
          placeholder="dd.mm.yyyy"
        />
      </div>
    </div>
    <div class="row no-border">
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(member.street, getFieldName('street')) }"
      >
        <label :for="getFieldName('street')">Straße: *</label>
        <input type="text" :id="getFieldName('street')" v-model="member.street" />
      </div>
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(member.streetNumber, getFieldName('streetNumber')) }"
      >
        <label :for="getFieldName('streetNumber')" class="padded-float">Hausnr: *</label>
        <input type="text" :id="getFieldName('streetNumber')" v-model="member.streetNumber" />
      </div>
    </div>
    <div class="row no-border">
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(member.zipCode, getFieldName('zipCode')) }"
      >
        <label :for="getFieldName('street')">PLZ: *</label>
        <input type="text" :id="getFieldName('zipCode')" v-model="member.zipCode" />
      </div>
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(member.city, getFieldName('city')) }"
      >
        <label :for="getFieldName('city')" class="padded-float">Ort: *</label>
        <input type="text" :id="getFieldName('city')" v-model="member.city" />
      </div>
    </div>
    <div
      class="row"
      :class="{ invalid: !isFieldSet(member.phoneNumber, getFieldName('phoneNumber'), true) }"
    >
      <div class="text-input">
        <label :for="getFieldName('phoneNumber')">{{
          getFieldWithConditionalRequiredMarker('Telefonnr.:')
        }}</label>
        <input type="text" :id="getFieldName('phoneNumber')" v-model="member.phoneNumber" />
      </div>
    </div>
    <div
      class="row"
      :class="{ invalid: !isFieldSet(member.email, getFieldName('email'), true) || invalidEmail }"
    >
      <div class="field-error" v-if="invalidEmail">Die Adresse hat kein gültiges Format!</div>
      <div class="text-input">
        <label :for="getFieldName('email')">{{
          getFieldWithConditionalRequiredMarker('eMail:')
        }}</label>
        <input type="text" :id="getFieldName('email')" v-model="member.email" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('isStudent')">Student/Schüler:</label>
        <div class="is-student">
          <div>
            <label> <input type="radio" v-model="member.isStudent" :value="true" /> Ja </label>
          </div>
          <div>
            <label> <input type="radio" v-model="member.isStudent" :value="false" /> Nein </label>
          </div>
        </div>
      </div>
    </div>
    <div class="row header-row" v-if="memberIsCreator()">Mitgliedschaft für Antragsteller</div>
    <div class="row" v-if="memberIsCreator()">
      <div class="form-input labeled-radio">
        <input
          type="radio"
          id="creator_with_membership"
          :value="creatorType"
          v-model="member.memberType"
        />
        <label for="creator_with_membership">Ich möchte selbst Mitglied werden</label>
      </div>
      <div class="form-input labeled-radio">
        <input
          type="radio"
          id="creator_without_membership"
          :value="creatorWithoutMembershipType"
          v-model="member.memberType"
        />
        <label for="creator_without_membership">Ich möchte den Antrag für meine Kinder stellen und nicht selbst Mitglied werden</label>
      </div>
    </div>
    <!-- MEMBERSHIP SECTIONS -->
    <div class="row header-row" v-if="member.memberType !== creatorWithoutMembershipType">Abteilungen (Mehrfachauswahl möglich)</div>
    <div class="row" v-if="member.memberType !== creatorWithoutMembershipType">
      <div class="d-flex d-flex-wrap">
        <div class="section-container">
          <div class="form-input">
            <input
              :id="getFieldName('section_football')"
              type="checkbox"
              v-model="member.sections.football"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label :for="getFieldName('section_football')">Fußball</label>
          </div>
          <div class="form-input">
            <input
              :id="getFieldName('section_bowling')"
              type="checkbox"
              v-model="member.sections.bowling"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label :for="getFieldName('section_bowling')">Kegeln</label>
          </div>
        </div>
        <div class="section-container">
          <div class="form-input">
            <input
              :id="getFieldName('section_theatre')"
              type="checkbox"
              v-model="member.sections.theatre"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label :for="getFieldName('section_theatre')">Theater</label>
          </div>
          <div class="form-input">
            <input
              :id="getFieldName('section_fitness')"
              type="checkbox"
              v-model="member.sections.fitness"
              :true-value="Checked.YES"
              :false-value="Checked.NO"
            />
            <label :for="getFieldName('section_fitness')">Fitness &amp; Freizeit</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-facing-decorator'
import { validateField } from '../utils/fieldValidator'
import { getDateOfBirthValidationMessage } from '../utils/dateUtils'
import { getMemberTitle } from '../utils/formattingUtils'
import { MemberType, type Member, type ValidationIssues } from '../types'
import { Checked } from '../types'

@Component({
  components: {},
  emits: ['removeMember']
})
export default class MemberEditor extends Vue {
  @Prop({ required: true }) member!: Member
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) validationActive!: boolean
  @Prop({ required: true }) validationIssues!: ValidationIssues

  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  Checked = Checked

  dateInvalidMessage: string | null = null

  creatorType = MemberType.CREATOR
  creatorWithoutMembershipType = MemberType.CREATOR_WITHOUT_MEMBERSHIP

  public getFieldName(name: string) {
    return name + '_' + this.index
  }

  public removeMember(index: number) {
    this.$emit('removeMember', index)
  }

  public memberIsCreator(): boolean {
    return this.member.memberType === MemberType.CREATOR || this.member.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP
  }

  public getFieldWithConditionalRequiredMarker(fieldName: string): string {
    if (this.index == 0) {
      return fieldName + ' *'
    }
    return fieldName
  }

  /**
   * Validate member's email in member.email. If validation is active, the following checks are performed:
   * - email is set
   * - email has valid format
   * - if email format is invalid, the issue is added to the validationIssues
   */
  get invalidEmail(): boolean {
    const issueKey = 'member.' + this.index + '.email'
    if (this.validationActive && this.member.email && this.member.email.trim() !== '') {
      if (!this.emailPattern.test(this.member.email.trim())) {
        this.validationIssues.issues.add(issueKey)
        return true
      }
    }
    this.validationIssues.issues.delete(issueKey)
    return false
  }

  /**
   * Validate member's date of birth in member.dateOfBirth. If the date is invalid, the validationIssues
   * are updated accordingly. Otherwise, the issue is removed from the validationIssues.
   *
   * Watches for changes in validationActive and calls this method accordingly.
   */
  @Watch('validationActive')
  validateDateOfBirth(): void {
    const issueKey = 'member.' + this.index + '.dateOfBirth'
    // remove all issues if validation is not active
    if (!this.validationActive) {
      this.validationIssues.issues.delete(issueKey)
      this.dateInvalidMessage = null
      return
    }

    // validate dateOfBirth and update validationIssues accordingly
    const validationMsg = getDateOfBirthValidationMessage(this.member.dateOfBirth)
    if (validationMsg) {
      this.validationIssues.issues.add(issueKey)
      this.dateInvalidMessage = validationMsg
    } else {
      this.validationIssues.issues.delete(issueKey)
      this.dateInvalidMessage = null
    }
  }

  public getMemberTitle(): string {
    let index = this.index
    return getMemberTitle(this.member)
  }

  @Watch('validationActive')
  public isFieldSet(value: any, key: string, onlyRequiredForFirst = false): boolean {
    // always validate to true if validation is not yet active
    if (onlyRequiredForFirst && this.index > 0) {
      this.validationIssues.issues.delete(key)
      return true
    }
    return validateField(this.validationActive, value, key, this.validationIssues.issues)
  }

  @Watch('validationActive')
  public validateAge(): void {

  }
}
</script>

<style lang="scss" scoped>
.is-student {
  display: flex;
  flex-wrap: wrap;

  label {
    padding-right: 20px;
  }
}

.info-text {
  padding: 10px;
  border: 1px solid darkgray;
  background-color: lighten(lightblue, 15);
}

.section-container {
  min-width: 35%;
}
</style>
