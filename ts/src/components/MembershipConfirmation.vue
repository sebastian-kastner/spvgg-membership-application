<template>
  <div class="membership-container">
    <div class="membership-wrapper">
      <div class="row header-row">Antrag überprüfen</div>
      <div class="row">
        <div class="label conf-col-50">Mitgliedschaft für:</div>
        <div class="conf-col-50 value">{{ membershipOwner }}</div>
      </div>
      <div class="row">
        <div class="label conf-col-50">Start der Mitgliedschaft:</div>
        <div class="conf-col-50 value">{{ membershipStart }}</div>
      </div>
      <div class="row">
        <div class="label conf-col-50">Mitgliedschaftstyp:</div>
        <div class="conf-col-50 value">{{ membershipType }}</div>
      </div>
      <div class="row">
        <div class="label conf-col-50">Abteilungen:</div>
        <div class="conf-col-50 value">{{ sections }}</div>
      </div>
      <div class="row header-row">Mitgliederdaten</div>
      <div class="member-summary" v-for="(person, index) in application.people" :key="index">
        <div class="row">
          <div class="member-header">{{ getMemberTitle(index) }}</div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Name:</div>
          <div class="conf-col-50 value">
            {{ getName(person) }}
          </div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Geburtsdatum:</div>
          <div class="conf-col-50 value">{{ person.dateOfBirth }}</div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Addresse:</div>
          <div class="conf-col-50 value">
            <div>{{ getStreet(person) }}</div>
            <div>{{ getCity(person) }}</div>
          </div>
        </div>
        <div class="row" v-if="person.email">
          <div class="label conf-col-50">Telefonnummer:</div>
          <div class="conf-col-50 value">{{ person.phoneNumber }}</div>
        </div>
        <div class="row" v-if="person.email">
          <div class="label conf-col-50">eMail:</div>
          <div class="conf-col-50 value">{{ person.email }}</div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Student:</div>
          <div class="conf-col-50 value">{{ isStudent(person) }}</div>
        </div>
      </div>
      <div class="row header-row">Bankdaten</div>
      <div class="row">
        <div class="label conf-col-50">IBAN:</div>
        <div class="conf-col-50 value">{{ application.iban }}</div>
      </div>
      <div class="row">
        <div class="label conf-col-50">BIC:</div>
        <div class="conf-col-50 value">{{ application.bic }}</div>
      </div>
      <div class="row">
        <div class="label conf-col-50">Kreditinstitut:</div>
        <div class="conf-col-50 value">{{ application.bankName }}</div>
      </div>
      <div class="row">
        <div class="label conf-col-50">Kontoinhaber:</div>
        <div class="conf-col-50 value">{{ application.bankAccountOwner }}</div>
      </div>
      <div class="row">
        <div class="conf-col-50">
          <input type="button" class="primary-btn" value="Bestätigen" @click="doSubmit" />
        </div>
        <div class="conf-col-50">
          <input type="button" class="secondary-btn" value="Überarbeiten" @click="doEdit" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import type { Application, AppMode, Person } from '../types'
import {
  getName,
  getMembershipStart,
  getCity,
  getStreet,
  getMemberTitle,
  getMembershipOwner,
  getMembershipType,
  getSections,
  getIsStudent,
  toString
} from '../membership_formatter'

@Component({
  components: {}
})
export default class MembershipConfirmation extends Vue {
  @Prop({ required: true }) appMode!: AppMode
  @Prop({ required: true }) application!: Application

  contents = JSON.stringify(this.application, null, 2)

  get membershipOwner(): string {
    return getMembershipOwner(this.application)
  }

  getMemberTitle(index: number): string {
    return getMemberTitle(index)
  }

  getName(person: Person): string {
    return getName(person)
  }

  getStreet(person: Person): string {
    return getStreet(person)
  }

  getCity(person: Person): string {
    return getCity(person)
  }

  get membershipStart(): string {
    return getMembershipStart(this.application)
  }

  get membershipType(): string {
    return getMembershipType(this.application);
  }

  get sections(): string {
    return getSections(this.application);
  }

  isStudent(person: Person): string {
    return getIsStudent(person);
  }

  doEdit(): void {
    this.appMode.isEditMode = true
  }

  doSubmit(): void {
    const summary = toString(this.application);
    console.log(summary);
    const base64 = btoa(summary);
    console.log(base64);
    console.log(base64.length);
  }
}
</script>

<style lang="scss" scoped>
.membership-container {
  line-height: 1.5;
}

.member-header {
  font-weight: bold;
  font-size: 17px;
}

.conf-col-50 {
  float: left;
  box-sizing: border-box;
  width: 50% !important;
}

.member-summary {
  padding-bottom: 10px;
  padding-top: 10px;
  border-bottom: 1px solid lightgray;
}

@media screen and (max-width: 500px) {
  .conf-col-50 {
    width: 100% !important;
  }
}

.label {
  min-width: 200px;
}

.value {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px;
  width: 100%;
}

.confirmation-button-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  margin-top: 20px;

  div {
    display: flex;
    justify-content: center;
  }

  input {
    margin-left: 10px;
  }
}
</style>
