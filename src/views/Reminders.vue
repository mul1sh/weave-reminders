<template>
    <div>
        <base-header type="gradient-primary" class="pb-6 pb-8 pt-5 pt-md-3">
        <div class="offset-11 col-xl-2 col-lg-2">
              <base-button type="primary" @click="logOut"> Log Out</base-button>
        </div>
        </base-header>
        
         <div class="container-fluid mt--7">
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
                                <div class="col-8">
                                    <h3 class="mb-0">My Reminder</h3>
                                </div>
                                <div class="col-4 text-right">
                                    <base-button type="primary" class="btn-sm" @click="sendTestEmail">
                                        Save Reminder
                                    </base-button>
                                </div>
                            </div>
                        </div>
                        <template>
                            <form @submit.prevent>
                                <h6 class="heading-small text-muted mb-4">User information</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="Username"
                                                        placeholder="Username"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.username"
                                            />
                                        </div>
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="Email address"
                                                        placeholder="jesse@example.com"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.email"
                                            />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="First name"
                                                        placeholder="First name"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.firstName"
                                            />
                                        </div>
                                        <div class="col-lg-6">
                                            <base-input alternative=""
                                                        label="Last name"
                                                        placeholder="Last name"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.lastName"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr class="my-4" />
                                <!-- Address -->
                                <h6 class="heading-small text-muted mb-4">Contact information</h6>
                                <div class="pl-lg-4">
                                    <div class="row">
                                        <div class="col-md-12">
                                            <base-input alternative=""
                                                        label="Address"
                                                        placeholder="Home Address"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.address"
                                            />
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="City"
                                                        placeholder="City"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.city"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Country"
                                                        placeholder="Country"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.country"
                                            />
                                        </div>
                                        <div class="col-lg-4">
                                            <base-input alternative=""
                                                        label="Postal code"
                                                        placeholder="Postal code"
                                                        input-classes="form-control-alternative"
                                                        v-model="model.zipCode"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <hr class="my-4" />
                                <!-- Description -->
                                <h6 class="heading-small text-muted mb-4">About me</h6>
                                <div class="pl-lg-4">
                                    <div class="form-group">
                                        <base-input alternative=""
                                                    label="About Me">
                                            <textarea rows="4" class="form-control form-control-alternative" placeholder="A few words about you ...">A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</textarea>
                                        </base-input>
                                    </div>
                                </div>
                            </form>
                        </template>
                    </card>
                </div>
            </div>
        </div>

    </div>
</template>
<script>

  // arweave


import { sendWeaveMail } from '../helpers/arweave';

  export default {
    components: {
     
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
        userName: "User",
        notificationsAllowed: false,
        notificationError: ""
      };
    },
    methods: {

        logOut(){
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('userArweaveAddress');
            localStorage.removeItem('userArweaveBalance');
            localStorage.removeItem('userWallet');

            // go back to login
            this.$router.push({ name: 'login'});
        },
        async sendTestEmail() {

           
        },

        allowNotifications(){

          // Let's check if the browser supports notifications
          if (!("Notification" in window)) {
            this.notificationError = "This browser does not support desktop notification";
          }

          // Let's check whether notification permissions have already been granted
          else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            this.notificationsAllowed = true;
          }

          // Otherwise, we need to ask the user for permission
          else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
              // If the user accepts, let's create a notification
              if (permission === "granted") {
                const msg = "Thank you for allowing notifications for weave reminders :)";
                var notification = new Notification(msg);
              }
              else {
                 this.notificationsAllowed = false;
              }
            });
          }
        }
     
    },
    mounted() {
     
    }
  };
</script>
<style scoped>
    .btn {
        color: #ffffff;
    }
</style>
