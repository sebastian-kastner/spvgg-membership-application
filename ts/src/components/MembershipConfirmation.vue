<template>
  <div class="membership-container" ref="scrollToDiv">
    <form :action="action" class="membership-wrapper" method="post">
      <input type="hidden" name="formatted_values" :value="formattedValues" />
      <input type="hidden" name="plain_values" :value="plainValues" />
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
          <input type="submit" class="primary-btn" value="Bestätigen" @click="doSubmit" />
        </div>
        <div class="conf-col-50">
          <input type="button" class="secondary-btn" value="Überarbeiten" @click="doEdit" />
        </div>
      </div>
    </form>
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

  formattedValues = "";
  plainValues = "";

  public mounted(): void {
    // create state for browser history to enable navigation using the browser's back button
    const title = document.title;
    const url = window.location.href + "#confirm";
    history.pushState({ }, title, url);
    // handle browser back event
    window.addEventListener('popstate', this.handleBrowserBack);

    this.formattedValues = btoa(toString(this.application));
    this.plainValues = btoa(JSON.stringify(this.application));

    // Use $refs to access the element with the specified ref
    const targetDiv = this.$refs.scrollToDiv as any;

    if (targetDiv) {
      // Scroll to the target div
      targetDiv.scrollIntoView({ behavior: "smooth" });
    }
  }

  public beforeUnmount(): void {
    // Remove the event listener when the component is about to be unmounted
    console.log("removing popstate listener");
    window.removeEventListener('popstate', this.handleBrowserBack);
  }

  private handleBrowserBack(): void {
    this.appMode.isEditMode = true;
  }

  get action(): string {
    return window.location.toString();
  }

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
    const title = document.title;
    const url = window.location.href.replace("#confirm", "");
    history.pushState({ }, title, url);

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
