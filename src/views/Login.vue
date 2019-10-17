<template>
        <div class="row justify-content-center">
            <base-alert type="danger" v-if="!notificationsAvailable">
                Sorry it seems notifications are not enabled in your browser, please try upgrading your browser or try a different one in-order to continue!
            </base-alert>
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-header bg-transparent pb-5">
                        <div class="text-muted text-center mt-2 mb-3">
                            <h2>Welcome to Weave Reminders</h2>
                            <h5>Your future reminders, stored securely in the permaweb</h5>
                            <h5>To continue, please load a valid Arweave Keystore.</h5>
                        </div>
                        <div class="btn-wrapper text-center">
                            <base-button @click="$refs.file.click()" type="primary" :disabled="!notificationsAvailable" v-if="!fetchingUserDetails">
                                <span class="btn-inner--text">Load Keystore</span>
                            </base-button>
                            <div class="spinner" v-if="fetchingUserDetails">
                                Fetching user details
                                 <atom-spinner
                                      :animation-duration="1000"
                                      :size="40"
                                      :color="'#5e72e4'"
                                 />
                            </div>
                        </div>
                        <div class="text-muted text-center mt-2 mb-3">
                            <h5>Need tokens or a wallet ?</h5>
                        </div>
                        <div class="btn-wrapper text-center">
                            <a href="https://tokens.arweave.org/" target="_blank" class="btn btn-neutral">
                                <span class="btn-inner--text">Get Some here</span>
                            </a>
                        </div>
                    </div>
                    <input type="file" ref="file" style="display: none" @change="fileSelected"/>
                   
                </div>
            </div>
        </div>
</template>
<script>
  
  import { getWalletAddress, getWalletBalance, getUserDetails, getTransactionDetails } from '../helpers/arweave';
  import { AtomSpinner } from 'epic-spinners';
  import router from '../router';

  export default {
    components: {
      AtomSpinner
    },
    name: 'login',
    data(){
        return {
            notificationsAvailable: false,
            fetchingUserDetails: false
        }
    },
    methods: {
        fileSelected(e){

            const filereader = new FileReader();

            filereader.addEventListener('loadend', async e => {
                try {
                    const userWallet = await JSON.parse(e.target.result);
                    const userArweaveAddress = await getWalletAddress(userWallet);
                    let userArweaveBalance = '';

                    if (userArweaveAddress) {
                        // first of all get the user's details/info
                        const username = await this.getUserInfo(userArweaveAddress);
                        userArweaveBalance = await getWalletBalance(userArweaveAddress);

                        // save the login state locally
                        localStorage.setItem('loggedIn', true);
                        localStorage.setItem('userArweaveAddress', userArweaveAddress);
                        localStorage.setItem('userArweaveBalance', userArweaveBalance);
                        localStorage.setItem('userWallet', JSON.stringify(userWallet));
                        localStorage.setItem('userName', username);

                        router.push({ name: 'reminders'});

                    } else {
                        throw new Error("Unable to get wallet address!!")
                    }
                  
                }
                catch(error){
                  console.log(error);
                }
            });

            filereader.readAsText(e.target.files[0]);
        },
        checkIfNotificationsAvailable() {
            // Let's check if the browser supports notifications
            if (!("Notification" in window)) {
                this.notificationsAvailable = false;
            } else{
                this.notificationsAvailable = true;
            }
        },
        getUserInfo(walletAddress){
            return new Promise(async (resolve, reject) => {
                    this.fetchingUserDetails = true;
                    let username = "User";
                    try {

                        const transactions = await getUserDetails(walletAddress);
                        transactions.forEach(async(tx) =>{

                            const transaction = await getTransactionDetails(tx);
                            const data = transaction.get('data', {decode: true, string: true});
                            // decode the tags
                            await transaction.get('tags').forEach(tag => {
                                let key = tag.get('name', {decode: true, string: true});
                                let value = tag.get('value', {decode: true, string: true});

                                if(key === "Type" && value === "name") {
                                    username = data;
                                    resolve(username);
                                }
                            });

                        });

                    }
                    catch(error) {
                        reject(error);
                    }
                    finally{
                        this.fetchingUserDetails = false;
                    }

            });

    
        },
    },
    created(){
        this.checkIfNotificationsAvailable();
    }
  }
</script>
<style scoped>
.spinner {
  display: flex;
  flex-direction: row;
  justify-content: center;
  color: #000000;
  font-weight: bold;
}
</style>
