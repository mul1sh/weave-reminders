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
                            <h5>To continue, please enter your arweave phrase below</h5>
                        </div>
                        <div class="btn-wrapper text-center">
                            <input type="text" id="login-txt" placeholder="i.e. maze eagle quit crash hedgehog work broccoli goat copper bleak flag siege" width="500"  v-model="arweavePhrase"/>
                            <base-button @click="login" 
                                         type="primary" 
                                        :disabled="!notificationsAvailable || arweavePhrase == ''"
                                         v-if="!fetchingUserDetails">
                                <span class="btn-inner--text">Login</span>
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
                            <h5>Please note you will need an ArweaveID Public Name inorder to login, otherwise your login will fail.</h5>
                        </div>
                        <div class="btn-wrapper text-center">
                            <a href="https://arweave.net/fGUdNmXFmflBMGI2f9vD7KzsrAc1s1USQgQLgAVT0W0" target="_blank" class="btn btn-secondary">
                                <span class="btn-inner--text">Set ArweaveID Details Here</span>
                            </a>
                        </div>
                        <div class="text-muted text-center mt-2 mb-3">
                            <h5>Need tokens or a wallet ?</h5>
                        </div>
                        <div class="btn-wrapper text-center">
                            <a href="https://tokens.arweave.org/" target="_blank" class="btn btn-neutral">
                                <span class="btn-inner--text">Get Some Here</span>
                            </a>
                        </div>
                    </div>
            
                </div>
            </div>
        </div>
</template>
<script>
  
  import { getWalletAddress, 
           getWalletBalance, 
           getUserDetails, 
           getTransactionDetails,
           getEncryptedWallet
            } from '../helpers/arweave';
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
            fetchingUserDetails: false,
            arweavePhrase: "",
        }
    },
    methods: {
        async login() {
            
            let publicKey = "";

            const mnemonic = this.arweavePhrase;

            const length = mnemonic.split(" ").length;

            if (length === 12 ){

                mnemonic.split(" ").forEach((word, index) => {
                    if (index <= 3) {
                       publicKey += word;
                    }
                });

                publicKey = btoa(publicKey);

                const txs = await getEncryptedWallet(publicKey);
                const tx = await getTransactionDetails(txs[0]);

                const data = tx.get('data', {decode: true, string: true});

                const encryptedWallet = CryptoJS.AES.decrypt(data, mnemonic);

                const stringWallet = encryptedWallet.toString(CryptoJS.enc.Utf8);

                const userWallet = JSON.parse(stringWallet);

                console.log(userWallet);

                try {
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

                   alert("Sorry, there is an error in getting your wallet, please check your phrase again!")
                }

            } else {
                alert("Sorry but the arweave phrase must have exactly 12 words, please check your phrase again!");
            }
        
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
                                     this.fetchingUserDetails = false;
                                    resolve(username);
                                }
                            });

                        });

                    }
                    catch(error) {
                        this.fetchingUserDetails = false;
                        alert("Sorry unable to fetch your ArweaveID public name :(")
                        reject(error);
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
#login-txt {
    width: 100%;
    margin-bottom: 5px;
}
</style>
