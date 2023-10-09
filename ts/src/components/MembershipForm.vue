<template>
    <div class="form-container">
        <form action="/action_page.php">
            <div class="row header-row">
                Wer soll Mitglied werden?
            </div>
            <div class="row d-flex align-items-center">
                <div class="col-50 d-flex">
                    <input type="radio" id="new_member_self" value="self" v-model="new_nember" />
                    <label for="new_member_self">Ich möchte Mitglied werden</label>
                </div>
                <div class="col-50 d-flex">
                    <input type="radio" id="new_member_other" value="other" v-model="new_nember" />
                    <label for="new_member_other">Ich möchte die Mitgliedschaft für eine andere Person beantragen</label>
                </div>
            </div>
            <div class="row header-row">
                Ab wann willst Du als Mitglied aufgenommen werden?
            </div>
            <div class="row">
                <div class="col-50 d-flex">
                    <input type="radio" id="membership_start_now" :value="membership_start_types.now"
                        v-model="membership_start">
                    <label for="membership_start_now">Nächstmöglicher Zeitpunkt</label>
                </div>
                <div class="col-50 d-flex">
                    <input type="radio" id="membership_start_from" :value="membership_start_types.from"
                        v-model="membership_start">
                    <label for="membership_start_from">Ab dem...</label>
                    <datepicker
                        v-model="membership_start_date"
                        :lowerLimit="new Date()"
                        :clearable="false"
                        :disabled="membership_start !== membership_start_types.from"
                    />
                    <!-- TBD: set upper limit and locale: https://www.npmjs.com/package/vue3-datepicker -->
                    <!-- <input type="text" placeholder="dd.mm.yyyy" v-model="membership_start_date"
                        :disabled="membership_start !== membership_start_types.from" /> -->
                </div>
            </div>
            <div class="row header-row">
                Welche Art von Mitgliedschaft willst du beantragen?
            </div>
            <div class="row d-flex align-items-center">
                <div class="col-50 d-flex">
                    <input type="radio" id="membership_type_family" value="self" v-model="membership_type" />
                    <label for="membership_type_family">Familienmitgliedschaft</label>
                </div>
                <div class="col-50 d-flex">
                    <input type="radio" id="membership_type_single" value="other" v-model="membership_type" />
                    <label for="membership_type_single">Einzelmitgliedschaft</label>
                </div>
            </div>
            <div class="row header-row">
                In welcher Abteilung möchtest Du/Ihr Mitglied sein? (Mehrfachauswahl möglich)
            </div>
            <div class="row">
                <div class="d-flex">
                    <span>
                        <input id="section_football" type="checkbox" v-model="sections.football" true-value="yes"
                            false-value="no" />
                        <label for="section_football">Fußball</label>
                    </span>

                    <span style="float: left;">
                        <input id="section_bowling" type="checkbox" v-model="sections.bowling" true-value="yes"
                            false-value="no" />
                        <label for="section_bowling">Kegeln</label>
                    </span>

                    <span style="float: left;">
                        <input id="section_theatre" type="checkbox" v-model="sections.theatre" true-value="yes"
                            false-value="no" />
                        <label for="section_theatre">Theater</label>
                    </span>

                    <span style="float: left;">
                        <input id="section_fitness" type="checkbox" v-model="sections.fitness" true-value="yes"
                            false-value="no" />
                        <label for="section_fitness">Fitness &amp; Freizeit</label>
                    </span>
                </div>
            </div>
            <div class="row">
                <input type="submit" value="Submit">
            </div>
        </form>
    </div>
</template>
  
<script lang="ts">
import { Component, Vue } from 'vue-facing-decorator';
import Datepicker from "vue3-datepicker";

@Component({
    components: { Datepicker },
})
export default class MembershipForm extends Vue {

    membership_start_types = {
        now: "now",
        from: "from",
    }

    new_nember = "";
    membership_start = "";
    membership_start_date = new Date();
    membership_type = "";

    sections = {
        "football": false,
        "bowling": false,
        "theatre": false,
        "fitness": false,
    }

    public activate_membership_start_from() {
        console.log("activate and all");
        if (this.membership_start !== this.membership_start_types.from) {
            // const currentDate = new Date();
            // const day = String(currentDate.getDate()).padStart(2, '0');
            // const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so we add 1
            // const year = String(currentDate.getFullYear());
            // this.membership_start_date = `${day}.${month}.${year}`;
            // console.log(this.membership_start_date);
        }
    }
}
</script>
  
<style lang="scss" scoped></style>
  