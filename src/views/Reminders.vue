<template>
    <div>
        <base-header type="gradient-primary" class="pb-6 pb-8 pt-5 pt-md-3">
          <div class="row">
                <div class="col-xl-3 col-lg-6">
                   
                </div>
                <div class="offset-11 col-xl-2 col-lg-2">
                  <base-button type="primary" @click="logOut"> Log Out</base-button>
                </div>
          </div>
        </base-header>
        <div class="allow-notifs text-center" v-if="!notificationsEnabled && !notificationsDenied">
            <div class="w-100 enable-notifs">
                 Please allow browser notifications below to continue using this permaweb app
            </div>
            <base-button type="primary" @click="checkIfNotificationsEnabled"> 
                Allow Notifications
            </base-button>
        </div>
        <div class="allow-notifs text-center" v-if="!notificationsEnabled && notificationsDenied">
            <div class="w-100 enable-notifs-settings">
                Sorry, but Weave Reminders has been denied displaying notifications in your browser and hence won't work as required. To fix this please enable them in your browser settings.
            </div>
        </div>
        <div class="container-fluid mt--7" v-if="notificationsEnabled && !notificationsDenied">
            <div class="row">
                <div class="col-xl-5 order-xl-2 mb-5 mb-xl-0">
                    <div class="card card-profile shadow">
                        <div class="card-body border-1">
                            <div>
                                  <div class="d-flex justify-content-center pb-2 border-1">
                                      <span class="heading">Arweave Wallet</span>
                                  </div>
                                  <div>
                                      <span class="heading">&nbsp; &nbsp; &nbsp; Address: </span>
                                      <span class="description">{{walletAddress}}</span>
                                  </div>
                                  <div>
                                      <span class="heading">AR Balance: </span>
                                      <span class="description">{{walletBalance}}</span>
                                  </div>
                              </div>
                        </div>
                    </div>
                </div>

                <div class="col-xl-7 order-xl-1">
                    <card shadow type="secondary">
                        <div slot="header" class="bg-white border-0">
                            <div class="row align-items-center">
                                <div class="col-4">
                                  Hi {{userName}}, 
                                </div>
                                <div class="col-4">
                                   
                                    <datetime type="datetime" 
                                              input-id="start-date" 
                                              :min-datetime="minDatetime"
                                              v-model="reminderDateTime" 
                                              use12-hour>
                                       <label for="start-date" slot="before">Select Reminder Date: </label>
                                    </datetime>
                                </div>
                                
                                <div class="col-4 text-right">
                                    <base-button type="primary" class="btn-sm" @click="save">
                                        Save Reminder
                                    </base-button>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <div class="pl-lg-1">
                                    <div class="form-group">
                                            <textarea rows="5" class="form-control form-control-alternative" placeholder="Remember to buy groceries.."></textarea>
                                    </div>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>

            <!--Tables-->
            <div class="row mt-5">
                <div class="col-xl-6 mb-5 mb-xl-0">
                    <upcoming-reminders></upcoming-reminders>
                </div>
                <div class="col-xl-6">
                    <past-reminders></past-reminders>
                </div>
            </div>
        </div>

    </div>
</template>
<script>

// arweave
import { saveReminder   } from '../helpers/arweave';
import { AtomSpinner } from 'epic-spinners';

// reminder tables
import UpcomingReminders from './Reminders/UpcomingReminders';
import PastReminders from './Reminders/PastReminders';

// moment
import moment from 'moment';



  export default {
    components: {
      UpcomingReminders,
      PastReminders,
      AtomSpinner
    },
    data() {
      return {
        model: {
          username: '',
          email: '',
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          country: '',
          zipCode: '',
          about: '',
        },
        walletAddress: "" || localStorage.getItem('userArweaveAddress'),
        walletBalance: "" || localStorage.getItem('userArweaveBalance'),
        userWallet: "" || localStorage.getItem('userWallet'),
        userName: "" || localStorage.getItem('userName'),
        notificationsEnabled: false,
        notificationsDenied: false,
        minDatetime: moment().toISOString(),
        reminderDateTime: moment().toISOString(),
      };
    },
    created(){
       if (Notification.permission === "granted") {
         this.notificationsEnabled = true;
       }
        if (Notification.permission === "denied") {
         this.notificationsDenied = true;
       }
    },
    methods: {

        logOut(){
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userArweaveAddress');
            localStorage.removeItem('userArweaveBalance');
            localStorage.removeItem('userWallet');
            localStorage.removeItem('userName');

            // go back to login
            this.$router.push({ name: 'login'});
        },
        checkIfNotificationsEnabled(){
          // Otherwise, we need to ask the user for permission
          if (Notification.permission !== "denied") {
            const vm = this;

            Notification.requestPermission().then(function (permission) {

              // If the user accepts, let's create a notification
              if (permission === "granted") {
                const msg = "Thank you :)";
                const notification = new Notification(msg);
                vm.notificationsEnabled = true;
              }

              if (permission === "denied") {
                vm.notificationsDenied = true;
                vm.notificationsEnabled = false;
              }
              
            });
          } 
        },
        save(){
            console.log(localStorage.getItem('userName'));
        }
     
    }
  };
</script>
<style scoped>
    .btn {
        color: #ffffff;
    }
    .allow-notifs{
        min-height: 65vh;
    }
    .enable-notifs{
        font-weight: bold;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    .enable-notifs-settings{
        font-weight: bold;
        color: #f5365c;
        padding-top: 5px;
        padding-bottom: 5px;
    }
</style>
