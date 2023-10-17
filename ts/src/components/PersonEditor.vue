<template>
  <div>
    <div class="row" v-if="index > 0">
      <div class="inline-button-container">
        <input type="button" value="- Mitglied entfernen" @click="removeMember(index)" />
      </div>
    </div>
    <div class="row">
      <div class="text-input col-50" :class="{ invalid: !isFieldSet(person.anrede, getFieldName('anrede')) }">
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
    <div class="row" :class="{ invalid: !isFieldSet(person.dateOfBirth, getFieldName('dateOfBirth')) }">
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
      <div class="text-input col-50" :class="{ invalid: !isFieldSet(person.street, getFieldName('street')) }">
        <label :for="getFieldName('street')">Straße: *</label>
        <input type="text" :id="getFieldName('street')" v-model="person.street" />
      </div>
      <div class="text-input col-50" :class="{ invalid: !isFieldSet(person.streetNumber, getFieldName('streetNumber')) }">
        <label :for="getFieldName('streetNumber')" class="padded-float">Hausnr: *</label>
        <input type="text" :id="getFieldName('streetNumber')" v-model="person.streetNumber" />
      </div>
    </div>
    <div class="row" :class="{ invalid: !isFieldSet(person.phoneNumber, getFieldName('phoneNumber'), true) }">
      <div class="text-input">
        <label :for="getFieldName('phoneNumber')">{{ getFieldWithConditionalRequiredMarker('Telefonnr:') }}</label>
        <input type="text" :id="getFieldName('phoneNumber')" v-model="person.phoneNumber" />
      </div>
    </div>
    <div class="row" :class="{ invalid: !isFieldSet(person.email, getFieldName('email'), true) }">
      <div class="text-input">
        <label :for="getFieldName('email')">{{ getFieldWithConditionalRequiredMarker('eMail:') }}</label>
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
import type { Person, ValidationIssues } from '../types'

@Component({
  components: {},
  emits: [ 'removeMember' ]
})
export default class PersonEditor extends Vue {
  @Prop({ required: true }) person!: Person
  @Prop({ required: true }) index!: number
  @Prop({ required: true }) validationActive!: boolean
  @Prop({ required: true }) validationIssues!: ValidationIssues

  public getFieldName(name: string) {
    return name + '_' + this.index
  }

  public removeMember(index: number) {
    this.$emit("removeMember", index);
  }

  public getFieldWithConditionalRequiredMarker(fieldName: string): string {
    if (this.index == 0) {
      return fieldName + " *";
    }
    return fieldName;
  }

  public isFieldSet(value: any, key: string, onlyRequiredForFirst = false): boolean {
    // always validate to true if validation is not yet active
    if (!this.validationActive) {
      return true
    }

    // validate to true if index > 0 and only required for first person in list
    if(onlyRequiredForFirst && this.index > 0) {
      return true;
    }

    // return false if no value is set
    if (!value) {
      this.validationIssues.missingRequiredFields.add(key);
      return false
    }
    this.validationIssues.missingRequiredFields.delete(key);
    return true
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
