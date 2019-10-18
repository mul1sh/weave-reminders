<template>
    <div>
        <base-header type="gradient-primary" class="pb-6 pb-8 pt-5 pt-md-3">
          <div class="row">
                <div class="col-xl-3 col-lg-6">
                   
                </div>
                <div class="offset-xl-11 offset-lg-11  col-xl-2 col-lg-2 offset-8 col-5">
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
                                    <base-button type="primary" 
                                                 class="btn-sm" 
                                                 :disabled='reminder.trim() =="" || savingReminder'
                                                 @click="save">

                                         {{savingReminder & !showFutureDateError ? 'Saving Reminder..':'Save Reminder'}}
                                        
                                    </base-button>
                                </div>

                            </div>
                        </div>
                        <template>
                          
                            <form @submit.prevent>
                                <div class="pl-lg-1">
                                    <div class="form-group">
                                            <textarea rows="3"
                                                      v-model="reminder"
                                                      class="form-control form-control-alternative reminder-text" 
                                                      placeholder="Remember to buy groceries.."/>
                                    </div>
                                </div>
                                <base-alert type="danger" v-if="showFutureDateError">
                                  Please select a future reminder date!
                                </base-alert>
                                <base-alert type="success" v-if="reminderSaved">
                                    The reminder has been saved successfully :)
                                </base-alert>
                            </form>
                        </template>
                    </card>
                </div>
            </div>

            <!--Tables-->
            <div>
              <div class="fetching-reminders" v-if="fetchingReminders">
                <span id="fetch-rem-txt">
                  Updating Reminders..
                </span>
              
                <atom-spinner
                      :animation-duration="1000"
                      :size="80"
                      :color="'#5e72e4'"
                />
              </div>
              <div class="row mt-5" v-else>
                <div class="col-xl-6 mb-5 mb-xl-0">
                    <upcoming-reminders :upcomingReminders="upcomingReminders"/>
                </div>
                <div class="col-xl-6">
                    <past-reminders :pastReminders="pastReminders"/>
                </div>
              </div>
                
            </div>
        </div>

    </div>
</template>
<script>

// arweave
import { saveReminder, getUserReminders, getTransactionDetails  } from '../helpers/arweave';
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
        reminder:"",
        reminderSaved: false,
        savingReminder: false,
        upcomingReminders: [],
        pastReminders:[],
        showFutureDateError: false,
        fetchingRemindersInterval: "",
        showRemindersInterval: "",
        fetchingReminders: false,
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
    async mounted(){

      // fetch the reminders first
      await this.fetchReminders();

      // then show any notifications afterwards
      await this.showReminders();

      // then repeat fetching reminders every 10 minutes
      this.fetchingRemindersInterval = setInterval(() => {
        this.fetchReminders();
      }, 600000);

      // then repeat showing reminders every 30 seconds
      this.showRemindersInterval = setInterval(() => {
        this.showReminders();
      }, 30000);
     
    },
    beforeDestroy(){
      // clear the intervals
      clearInterval(this.fetchingRemindersInterval);
      clearInterval( this.showRemindersInterval);
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
        async save(){

          // first of all check if the date is in the fute
          const now = moment(); //current date
          const end = moment(this.reminderDateTime); // another date
          const duration = moment.duration(end.diff(now));
          const secs = duration.asSeconds();
        
          if(secs > 0){

            this.savingReminder = true;

            const reminder = {
              reminder: this.reminder,
              reminderDate: this.reminderDateTime,
            };

            const userWallet = JSON.parse(this.userWallet);

            // save the reminder first in upcoming reminders
            reminder.reminderFormattedDate = end.format("dddd, MMMM Do YYYY, h:mm:ss a");
            reminder.sortDate = new Date(reminder.reminderDate);
            this.upcomingReminders.push(reminder);
            this.upcomingReminders = this.upcomingReminders.sort((a,b) => b.sortDate - a.sortDate);
          
            try {
              this.reminderSaved = await saveReminder(userWallet, reminder);
              
              if(this.reminderSaved) {

                const self = this;
                let reminderId = undefined;
                reminderId = setTimeout(function(){
                    self.reminderSaved = false;
                    // then clear the timeout
                    clearTimeout(reminderId);
                }, 2000);

              }

            }
            catch(error) {
              console.log(error);
            }
            finally{
              this.savingReminder = false;
            }

          } else {

            this.showFutureDateError = true;

            const self = this;
            let timeoutId = undefined;
            timeoutId = setTimeout(function(){
              self.showFutureDateError = false;
              // then clear the timeout
              clearTimeout(timeoutId);
            }, 2000);

          }
        },
        async fetchReminders(){

          this.fetchingReminders = true;
          let reminders = [];
          try {

              const transactions = await getUserReminders(this.walletAddress);
              let count =0;
              transactions.forEach(async(tx) =>{

                  const transaction = await getTransactionDetails(tx);
                  const data = transaction.get('data', {decode: true, string: true});
                  const reminder = {};
                  reminder.reminder = data;
                  // decode the tags
                  const tags = await transaction.get('tags')
                  tags.forEach(tag => {
                      let key = tag.get('name', {decode: true, string: true});
                      let value = tag.get('value', {decode: true, string: true});

                      if(key==="wevr-reminder-date") {
                        reminder.reminderDate = value;
                        reminders.push(reminder);
                      }

                  });

                  count++;

                  if (count === transactions.length) {
                    this.fetchingReminders = false;
                    this.sortReminders(reminders);
                  }
              });
          }
          catch(error) {
            this.fetchingReminders = false;
            console.log(error);
          }
         
        },
        sortReminders(reminders) {

          const self = this;
          // reset the arrays
          this.upcomingReminders = [];
          this.pastReminders = [];
          reminders.forEach((reminder)=>{
              const now = moment(); //current date
              const end = moment(reminder.reminderDate); // another date
              const duration = moment.duration(end.diff(now));
              const secs = duration.asSeconds();

              reminder.reminderFormattedDate = end.format("dddd, MMMM Do YYYY, h:mm:ss a");
              reminder.sortDate = new Date(reminder.reminderDate);
            
              if(secs > 0){ // an upcoming reminder
                self.upcomingReminders.push(reminder);
              } else{ // past reminder
                self.pastReminders.push(reminder);
              }
          });

          // sort the reminders by date
          this.upcomingReminders = this.upcomingReminders.sort((a,b) => b.sortDate - a.sortDate);
          this.pastReminders = this.pastReminders.sort((a,b) => b.sortDate - a.sortDate);
        },
        showReminders(){
          this.upcomingReminders .forEach((reminder, index)=>{
              const now = moment(); //current date
              const end = moment(reminder.reminderDate); // another date
              const duration = moment.duration(end.diff(now));
              const secs = duration.asSeconds();

              if (secs > 0 && secs < 60) {
                // show the reminder
                const msg = reminder.reminder;
                const notification = new Notification(msg);

                // notifications sound
                const audio = new Audio(require('../assets/sounds/notif.mp3'));
                audio.play();

                // then add it to past reminders
                reminder.reminderFormattedDate = end.format("dddd, MMMM Do YYYY, h:mm:ss a");
                reminder.sortDate = new Date(reminder.reminderDate);
                this.pastReminders.push(reminder);

                // finally remove it from upcoming reminders array
                this.upcomingReminders.splice(index,1);
              }
          });

          // sort the reminders by date
          this.upcomingReminders = this.upcomingReminders.sort((a,b) => b.sortDate - a.sortDate);
          this.pastReminders = this.pastReminders.sort((a,b) => b.sortDate - a.sortDate);
          
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
    .reminder-text{
       color: #000000;
    }
    .fetching-reminders {
      display: flex;
      flex-direction: row;
      justify-content: center;
      margin-top: 40px;
      font-weight: bold;
    }
    #fetch-rem-txt {
      padding-top: 30px;
      padding-right: 30px;
    }
</style>
