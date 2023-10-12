<template>
  <div class="row">
    <div class="row">
      <div class="text-input col-50">
        <label :for="getFieldName('anrede')">Anrede:</label>
        <select v-model="person.anrede" :id="getFieldName('anrede')">
          <option value="">--</option>
          <option value="Herr">Herr</option>
          <option value="Frau">Frau</option>
        </select>
      </div>
      <div class="text-input col-50">
        <label :for="getFieldName('title')" class="padded-float">Titel:</label>
        <input type="text" :id="getFieldName('title')" v-model="person.title" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('firstName')">Vorname:</label>
        <input type="text" :id="getFieldName('firstName')" v-model="person.firstName" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('lastName')">Nachname:</label>
        <input type="text" :id="getFieldName('lastName')" v-model="person.lastName" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('dateOfBirth')">Geburtsdatum:</label>
        <input type="text" :id="getFieldName('dateOfBirth')" v-model="person.dateOfBirth" placeholder="dd.mm.yyyy"/>
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('street')">Straße:</label>
        <input type="text" :id="getFieldName('street')" v-model="person.street" />
      </div>
    </div>
    <div class="row">
      <div class="text-input col-50">
        <label :for="getFieldName('street')">Straße:</label>
        <input type="text" :id="getFieldName('street')" v-model="person.street" />
      </div>
      <div class="text-input col-50">
        <label :for="getFieldName('streetNumber')" class="padded-float">Hausnr:</label>
        <input type="text" :id="getFieldName('streetNumber')" v-model="person.streetNumber" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('phoneNumber')">Telefonnummer:</label>
        <input type="text" :id="getFieldName('phoneNumber')" v-model="person.phoneNumber" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('email')">eMail:</label>
        <input type="text" :id="getFieldName('email')" v-model="person.email" />
      </div>
    </div>
    <div class="row">
      <div class="text-input">
        <label :for="getFieldName('isStudent')">Student/Schüler:</label>
        <div>
          <label>
            <input type="radio" v-model="person.isStudent" value="true" /> Ja
          </label>
          <label>
            <input type="radio" v-model="person.isStudent" value="false" /> Nein
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-facing-decorator'
import type { Person } from '../types';

@Component({
  components: { }
})
export default class PersonView extends Vue {
  @Prop person!: Person;
  @Prop index!: number;

  public getFieldName(name: string) {
    return name + '_' + this.index;
  }
}
</script>

<style lang="scss" scoped></style>
