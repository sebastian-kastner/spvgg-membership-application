<template>
  <div class="membership-container">
    <div class="row header-row">Antrag überprüfen</div>
    <div class="row">
      <div class="label">Mitgliedschaft für:</div>
      <div>{{ membershipOwner }}</div>
    </div>
    <div class="row">
      <div class="label">Start der Mitgliedschaft:</div>
      <div>{{ membershipStart }}</div>
    </div>
    <div class="row">
      <div class="label">Mitgliedschaftstyp:</div>
      <div>{{ membershipType }}</div>
    </div>
    <div class="row">
      <div class="label">Abteilungen:</div>
      <div>{{ sections }}</div>
    </div>
    <div class="row header-row">Mitgliederdaten</div>
    <div v-for="(person, index) in application.people" :key="index">
      <div class="row">
        <div class="label">Name:</div>
        <div>{{ person.anrede }} {{ person.firstName }} {{ person.lastName }}</div>
      </div>
      <div class="row">
        <div class="label">Geburtsdatum:</div>
        <div>{{ person.dateOfBirth }}</div>
      </div>
      <div class="row">
        <div class="label">Addresse:</div>
        <div>
          {{ person.street }} {{ person.streetNumber }}, {{ person.zipCode }} {{ person.city }}
        </div>
      </div>
      <div class="row">
        <div class="label">Telefonnummer:</div>
        <div>{{ person.phoneNumber }}</div>
      </div>
      <div class="row">
        <div class="label">eMail:</div>
        <div>{{ person.email }}</div>
      </div>
      <div class="row">
        <div class="label">Student:</div>
        <div>{{ isStudent(person) }}</div>
      </div>
    </div>
    <div class="row header-row">Bankdaten</div>
    <div class="row">
      <div class="label">IBAN:</div>
      <div>{{ application.iban }}</div>
    </div>
    <div class="row">
      <div class="label">BIC:</div>
      <div>{{ application.bic }}</div>
    </div>
    <div class="row">
      <div class="label">Kreditinstitut:</div>
      <div>{{ application.bankName }}</div>
    </div>
    <div class="row">
      <div class="label">Kontoinhaber:</div>
      <div>{{ application.bankAccountOwner }}</div>
    </div>
    <div class="row inline-button-container">
      <input type="button" value="Editieren" @click="doEdit" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import { MembershipTypes, MembershipOwnerTypes, MembershipStartTypes, Checked } from '../types'
import type { Application, AppMode, Person } from '../types'

@Component({
  components: {}
})
export default class MembershipConfirmation extends Vue {
  @Prop({ required: true }) appMode!: AppMode
  @Prop({ required: true }) application!: Application

  contents = JSON.stringify(this.application, null, 2)

  get membershipOwner(): string {
    if (this.application.membership_owner === MembershipOwnerTypes.SELF) {
      return 'Antragssteller'
    }
    return 'Andere Person'
  }

  get membershipStart(): string {
    if (
      this.application.membership_start === MembershipStartTypes.FROM &&
      this.application.membership_start_date
    ) {
      const date = this.application.membership_start_date
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-based
      const year = date.getFullYear()

      return `${day}.${month}.${year}`
    }
    return 'Nächstmöglicher Zeitpunkt'
  }

  get membershipType(): string {
    if (this.application.membership_type === MembershipTypes.FAMILY) {
      return 'Familienmitgliedschaft'
    }
    return 'Einzelmitgliedschaft'
  }

  get sections(): string {
    const sections: string[] = []
    if (this.application.sections.football === Checked.YES) {
      sections.push('Fußball')
    }
    if (this.application.sections.bowling === Checked.YES) {
      sections.push('Kegeln')
    }
    if (this.application.sections.fitness === Checked.YES) {
      sections.push('Fitness & Freizeit')
    }
    if (this.application.sections.theatre === Checked.YES) {
      sections.push('Theater')
    }
    return sections.join(', ')
  }

  isStudent(person: Person): string {
    if (person.isStudent) {
      return 'Ja'
    }
    return 'Nein'
  }

  doEdit(): void {
    this.appMode.isEditMode = true
  }
}
</script>

<style lang="scss" scoped>
// i have no idea why this is required!
.membership-container {
  justify-content: start;
  display: block;
  line-height: 1.5;
}

.row {
  display: flex;
  flex-wrap: wrap;
}

.label {
  min-width: 200px;
}
</style>
