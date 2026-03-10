<template>
  <div class="membership-container" ref="scrollToDiv">
    <form :action="action" class="membership-wrapper" method="post">
      <input type="hidden" name="formatted_values" :value="formattedValues" />
      <input type="hidden" name="plain_values" :value="plainValues" />
      <input type="hidden" name="summary_text" :value="summaryText" />
      <div class="row header-row">Antrag überprüfen</div>
      <div class="row">
        <div class="label conf-col-50">Start der Mitgliedschaft:</div>
        <div class="conf-col-50 value">{{ membershipStart }}</div>
      </div>

      <!-- Antragsteller -->
      <div class="row header-row">Antragsteller</div>
      <div class="member-summary">
        <div class="row">
          <div class="label conf-col-50">Name:</div>
          <div class="conf-col-50 value">
            {{ getName(application.members.creator) }}
          </div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Geburtsdatum:</div>
          <div class="conf-col-50 value">{{ application.members.creator.dateOfBirth }}</div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Familienstand:</div>
          <div class="conf-col-50 value">{{ application.members.creator.maritalStatus }}</div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Addresse:</div>
          <div class="conf-col-50 value">
            <div>{{ getStreet(application.members.creator) }}</div>
            <div>{{ getCity(application.members.creator) }}</div>
          </div>
        </div>
        <div class="row" v-if="application.members.creator.email">
          <div class="label conf-col-50">Telefonnummer:</div>
          <div class="conf-col-50 value">
            {{ getValueOrPlaceholder(application.members.creator.phoneNumber) }}
          </div>
        </div>
        <div class="row" v-if="application.members.creator.email">
          <div class="label conf-col-50">eMail:</div>
          <div class="conf-col-50 value">
            {{ getValueOrPlaceholder(application.members.creator.email) }}
          </div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Student:</div>
          <div class="conf-col-50 value">{{ isStudent(application.members.creator) }}</div>
        </div>
        <div class="row" v-if="membershipFor(application.members.creator)">
          <div class="label conf-col-50">Abteilungen:</div>
          <div class="conf-col-50 value">
            {{ getValueOrPlaceholder(getSections(application.members.creator.sections)) }}
          </div>
        </div>
        <div class="row">
          <div class="label conf-col-50">Mitgliedschaft für Antragsteller:</div>
          <div class="conf-col-50 value" v-if="membershipFor(application.members.creator)">JA</div>
          <div class="conf-col-50 value" v-else>NEIN</div>
        </div>
      </div>

      <!-- (Ehe)partner -->
      <div v-if="application.members.spouse">
        <div class="row header-row">Ehepartner</div>
        <div class="member-summary">
          <div class="row">
            <div class="label conf-col-50">Name:</div>
            <div class="conf-col-50 value">
              {{ getName(application.members.spouse) }}
            </div>
          </div>
          <div class="row">
            <div class="label conf-col-50">Geburtsdatum:</div>
            <div class="conf-col-50 value">{{ application.members.spouse.dateOfBirth }}</div>
          </div>
          <div class="row">
            <div class="label conf-col-50">Student:</div>
            <div class="conf-col-50 value">{{ isStudent(application.members.spouse) }}</div>
          </div>
          <div class="row">
            <div class="label conf-col-50">Abteilungen:</div>
            <div class="conf-col-50 value">
              {{ getValueOrPlaceholder(getSections(application.members.spouse.sections)) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Kinder -->
      <div v-if="application.members.children.length > 0">
        <div class="row header-row">Kinder</div>
        <div
          class="member-summary"
          v-for="(child, index) in application.members.children"
          :key="index"
        >
          <div class="row">
            <div class="label conf-col-50">Name:</div>
            <div class="conf-col-50 value">
              {{ getName(child) }}
            </div>
          </div>
          <div class="row">
            <div class="label conf-col-50">Geburtsdatum:</div>
            <div class="conf-col-50 value">{{ child.dateOfBirth }}</div>
          </div>
          <div class="row">
            <div class="label conf-col-50">Abteilungen:</div>
            <div class="conf-col-50 value">
              {{ getValueOrPlaceholder(getSections(child.sections)) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bankdaten -->
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
      <div class="confirmation-button-container">
        <div>
          <input type="submit" class="primary-btn" value="Bestätigen" />
        </div>
        <div>
          <input type="button" class="secondary-btn" value="Überarbeiten" @click="doEdit" />
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import { MemberType, type Application, type AppMode, type Member, type Sections } from '../types'
import {
  getName,
  getMembershipStart,
  getCity,
  getStreet,
  getSections,
  getIsStudent,
  getMemberTitle,
  base64Encode,
  formatApplication,
  formatSummary,
  getAllMembers
} from '../utils/formattingUtils'

@Component({
  components: {}
})
export default class MembershipConfirmation extends Vue {
  @Prop({ required: true }) appMode!: AppMode
  @Prop({ required: true }) application!: Application

  formattedValues = ''
  plainValues = ''
  summaryText = ''

  public mounted(): void {
    // create state for browser history to enable navigation using the browser's back button
    if (window.location.href.indexOf('#confirm') != -1) {
      const title = document.title
      const url = window.location.href + '#confirm'
      history.pushState({}, title, url)
    }

    // handle browser back event
    window.addEventListener('popstate', this.handleBrowserBack)

    this.summaryText = base64Encode(formatSummary(this.application))
    this.formattedValues = base64Encode(formatApplication(this.application))
    this.plainValues = base64Encode(JSON.stringify(this.application))

    // Use $refs to access the element with the specified ref
    const targetDiv = this.$refs.scrollToDiv as any

    if (targetDiv) {
      // Scroll to the target div
      targetDiv.scrollIntoView({ behavior: 'smooth' })
    }
  }

  public beforeUnmount(): void {
    // Remove the event listener when the component is about to be unmounted
    window.removeEventListener('popstate', this.handleBrowserBack)
  }

  private handleBrowserBack(): void {
    this.appMode.isEditMode = true
  }

  get members(): Member[] {
    return getAllMembers(this.application)
  }

  get action(): string {
    return window.location.toString()
  }

  membershipFor(member: Member): boolean {
    if (member.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
      return false
    }
    return true
  }

  getName(member: Member): string {
    return getName(member)
  }

  getStreet(member: Member): string {
    return getStreet(member)
  }

  getCity(member: Member): string {
    return getCity(member)
  }

  getValueOrPlaceholder(value: any): string {
    if (!value || value === '') {
      return '-'
    }
    return value
  }

  get membershipStart(): string {
    return getMembershipStart(this.application)
  }

  getSections(sections: Sections): string {
    return getSections(sections)
  }

  isStudent(member: Member): string {
    return getIsStudent(member)
  }

  getMemberTitle(member: Member, index: number): string {
    return getMemberTitle(member, index)
  }

  doEdit(): void {
    const title = document.title
    const url = window.location.href.replace('#confirm', '')
    history.pushState({}, title, url)

    this.appMode.isEditMode = true
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
