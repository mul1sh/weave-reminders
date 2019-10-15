<template>
        <div class="row justify-content-center">
            <div class="col-lg-5 col-md-7">
                <div class="card bg-secondary shadow border-0">
                    <div class="card-header bg-transparent pb-5">
                        <div class="text-muted text-center mt-2 mb-3">
                            <h2>Welcome to Weave Reminders</h2>
                            <h5>Your future reminders, stored securely in the permaweb</h5>
                            <h5>To continue, please load a valid Arweave Keystore.</h5>
                        </div>
                        <div class="btn-wrapper text-center">
                            <a href="#" @click="$refs.file.click()" class="btn btn-primary">
                                <span class="btn-inner--text">Load Keystore</span>
                            </a>
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
  
  import { getWalletAddress, getWalletBalance } from '../helpers/arweave';
  import router from '../router'

  export default {
    name: 'login',
    methods: {
        fileSelected(e){

            const filereader = new FileReader();

            filereader.addEventListener('loadend', async e => {
                try {
                    const userWallet = await JSON.parse(e.target.result);
                    const userArweaveAddress = await getWalletAddress(userWallet);
                    let userArweaveBalance = '';

                    if (userArweaveAddress) {
                        userArweaveBalance = await getWalletBalance(userArweaveAddress);

                        // save the login state locally
                        localStorage.setItem('loggedIn', true);
                        localStorage.setItem('userArweaveAddress', userArweaveAddress);
                        localStorage.setItem('userArweaveBalance', userArweaveBalance);

                        console.log(this);

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
        }
    }
  }
</script>
<style>
</style>
