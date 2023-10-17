<template>
  <div>
    <div class="row" v-if="index > 0">
      <div class="inline-button-container">
        <input type="button" value="- Mitglied entfernen" @click="removeMember(index)" />
      </div>
    </div>
    <div class="row">
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(person.anrede, getFieldName('anrede')) }"
      >
        <label :for="getFieldName('anrede')">Anrede: *</label>
        <select v-model="person.anrede" :id="getFieldName('anrede')">
          <option value="--">--</option>
          <option value="Herr">Herr</option>
          <option value="Frau">Frau</option>
        </select>
      </div>
      <div class="text-input col-50">
        <label :for="getFieldName('title')" class="padded-float">Titel:</label>
        <input type="text" :id="getFieldName('title')" v-model="person.title" />
      </div>
    </div>
    <div class="row" :class="{ invalid: !isFieldSet(person.firstName, getFieldName('firstName')) }">
      <div class="text-input">
        <label :for="getFieldName('firstName')">Vorname: *</label>
        <input type="text" :id="getFieldName('firstName')" v-model="person.firstName" />
      </div>
    </div>
    <div class="row" :class="{ invalid: !isFieldSet(person.lastName, getFieldName('lastName')) }">
      <div class="text-input">
        <label :for="getFieldName('lastName')">Nachname: *</label>
        <input type="text" :id="getFieldName('lastName')" v-model="person.lastName" />
      </div>
    </div>
    <div
      class="row"
      :class="{
        invalid: !isFieldSet(person.dateOfBirth, getFieldName('dateOfBirth')) || invalidDateOfBirth
      }"
    >
      <div class="field-error" v-if="invalidDateOfBirth">
        Das Gebursdatum muss im Format dd.mm.yyyy angegeben werden (z.B. 27.03.2009)
      </div>
      <div class="text-input">
        <label :for="getFieldName('dateOfBirth')">Geburtsdatum: *</label>
        <input
          type="text"
          :id="getFieldName('dateOfBirth')"
          v-model="person.dateOfBirth"
          placeholder="dd.mm.yyyy"
        />
      </div>
    </div>
    <div class="row">
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(person.street, getFieldName('street')) }"
      >
        <label :for="getFieldName('street')">Straße: *</label>
        <input type="text" :id="getFieldName('street')" v-model="person.street" />
      </div>
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(person.streetNumber, getFieldName('streetNumber')) }"
      >
        <label :for="getFieldName('streetNumber')" class="padded-float">Hausnr: *</label>
        <input type="text" :id="getFieldName('streetNumber')" v-model="person.streetNumber" />
      </div>
    </div>
    <div class="row">
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(person.zipCode, getFieldName('zipCode')) }"
      >
        <label :for="getFieldName('street')">PLZ: *</label>
        <input type="text" :id="getFieldName('zipCode')" v-model="person.zipCode" />
      </div>
      <div
        class="text-input col-50"
        :class="{ invalid: !isFieldSet(person.city, getFieldName('city')) }"
      >
        <label :for="getFieldName('city')" class="padded-float">Ort: *</label>
        <input type="text" :id="getFieldName('city')" v-model="person.city" />
      </div>
    </div>
    <div
      class="row"
      :class="{ invalid: !isFieldSet(person.phoneNumber, getFieldName('phoneNumber'), true) }"
    >
      <div class="text-input">
        <label :for="getFieldName('phoneNumber')">{{
          getFieldWithConditionalRequiredMarker('Telefonnr:')
        }}</label>
        <input type="text" :id="getFieldName('phoneNumber')" v-model="person.phoneNumber" />
      </div>
    </div>
    <div
      class="row"
      :class="{ invalid: !isFieldSet(person.email, getFieldName('email'), true) || invalidEmail }"
    >
      <div class="field-error" v-if="invalidEmail">Die Adresse hat kein gültiges Format!</div>
      <div class="text-input">
        <label :for="getFieldName('email')">{{
          getFieldWithConditionalRequiredMarker('eMail:')
        }}</label>
        <input type="text" :id="getFieldName('email')" v-model="person.email" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('isStudent')">Student/Schüler:</label>
        <div>
          <label> <input type="radio" v-model="person.isStudent" value="true" /> Ja </label>
          <label> <input type="radio" v-model="person.isStudent" value="false" /> Nein </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import { validateField } from '../fieldValidator'
import type { Person, ValidationIssues } from '../types'

@Component({
  components: {},
  emits: ['removeMember']
})
export default class PersonEditor extends Vue {
  @Prop({ required: true }) person!: Person
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) validationActive!: boolean
  @Prop({ required: true }) validationIssues!: ValidationIssues

  emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
  dateOfBirthPattern = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/

  public getFieldName(name: string) {
    return name + '_' + this.index
  }

  public removeMember(index: number) {
    this.$emit('removeMember', index)
  }

  public getFieldWithConditionalRequiredMarker(fieldName: string): string {
    if (this.index == 0) {
      return fieldName + ' *'
    }
    return fieldName
  }

  get invalidEmail(): boolean {
    const issueKey = 'member.' + this.index + '.email'
    if (this.validationActive && this.person.email && this.person.email.trim() !== '') {
      if (!this.emailPattern.test(this.person.email.trim())) {
        this.validationIssues.issues.add(issueKey)
        return true
      }
    }
    this.validationIssues.issues.delete(issueKey)
    return false
  }

  get invalidDateOfBirth(): boolean {
    const issueKey = 'member.' + this.index + '.dateOfBirth'
    if (this.validationActive && this.person.dateOfBirth && this.person.dateOfBirth.trim() !== '') {
      if (!this.dateOfBirthPattern.test(this.person.dateOfBirth.trim())) {
        this.validationIssues.issues.add(issueKey);
        return true;
      }
    }
    this.validationIssues.issues.delete(issueKey);
    return false
  }

  public isFieldSet(value: any, key: string, onlyRequiredForFirst = false): boolean {
    // always validate to true if validation is not yet active
    if (onlyRequiredForFirst && this.index > 0) {
      this.validationIssues.issues.delete(key)
      return true
    }
    return validateField(
      this.validationActive,
      value,
      key,
      this.validationIssues.issues
    )
  }
}
</script>

<style lang="scss" scoped>
.inline-button-container {
  input[type='button'] {
    background-color: lighten(orange, 20%);
    color: black;
  }
}
</style>
