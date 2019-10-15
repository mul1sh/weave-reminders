import Arweave from 'arweave/web';

const arweaveOptions = {
    host: 'arweave.net',// Hostname or IP address for a Arweave node
    port: 443,           // Port, defaults to 1984
    protocol: 'https',  // Network protocol http or https, defaults to http
    timeout: 20000,     // Network request timeouts in milliseconds
    logging: false,     // Enable network request logging
};

const arweave = Arweave.init(arweaveOptions);

export const getWalletAddress = async (wallet) => {
    let arweaveAddress = undefined;
	try {
      arweaveAddress = await arweave.wallets.jwkToAddress(wallet);
	}
	catch(error) {
      console.log("unable to get wallet address");
	}
	return arweaveAddress;
}

export const getWalletBalance = async (walletAddress) => {
    let arweaveBalance = undefined;

	try {
      const balance = await arweave.wallets.getBalance(walletAddress);

      if (balance) {
      	arweaveBalance = arweave.ar.winstonToAr(balance);
      }
	}
	catch(error) {
      console.log("unable to get wallet balance");
	}

	return arweaveBalance;
}

export const getWalletTransactions = async (walletAddress) => {
    let arweaveTransactions = [];

	try {
      arweaveTransactions = await arweave.arql({
		    op: "equals",
		    expr1: "from",
		    expr2: walletAddress
		});
	}
	catch(error) {
      console.log("unable to get wallet transactions");
	}

	return arweaveTransactions;
}

export const getTransactionDetails = async (transactionId) => {
	let transactionDetails = null;

	try {
		transactionDetails = await arweave.transactions.get(transactionId);
	}
	catch(error) {
		console.error(error);
		console.error("unable to get transaction details");
	}

	return transactionDetails;
}

export const saveReminder = async(userWallet, data) => {
	let reminderSaved = false;

	try {
       let transaction = await arweave.createTransaction({ data: data.reminder}, userWallet);
	   transaction.addTag('wevr-reminder-date-added', data.dateAdded);
	   transaction.addTag('wevr-reminder-location', data.memoLocation);
	   transaction.addTag('wevr-reminder-saved', 'yes');

	   await arweave.transactions.sign(transaction, userWallet);

	   const response = await arweave.transactions.post(transaction);
       reminderSaved = response.status === 200 ? true : false;
	}
	catch (error) {
		console.error(error);
		console.error("unable to save reminder");
	}
	
	return reminderSaved;
}

export const getUserReminders = async (walletAddress) => {
	let userMemos = [];

	try {
        userMemos = await arweave.arql({
		      op: "and",
			  expr1: {
			    op: "equals",
			    expr1: "from",
			    expr2: walletAddress
			  },
			  expr2: {
			    op: "equals",
			    expr1: "wevr-reminder-saved",
			    expr2: "yes"
			  }
		});
  
	}
	catch(error) {
	  console.log(error);
      console.log("unable to get user memos");
	}

	return userMemos;
}

// file helpers
export const blobToBase64 = (file, callback) => {
        const reader = new FileReader();
        reader.onload = function() {
            var dataUrl = reader.result;
            var base64 = dataUrl.split(',')[1];
            callback(base64);
        };
        reader.readAsDataURL(file);
};


export const base64toBlob = async (b64Data, contentType) => {
  const url = `data:${contentType};base64,${b64Data}`;
  const response = await fetch(url);
  const blob = await response.blob();
  return blob;
};

const generateRandomBytes  = async (length) => {
    var array = new Uint8Array(length)
    window.crypto.getRandomValues(array)

    return array
};

export const encryptMail = async (content, subject, pub_key) => {
    var content_encoder = new TextEncoder()
    var newFormat = JSON.stringify({ 'subject': subject, 'body': content })
    var mail_buf = content_encoder.encode(newFormat)
    var key_buf = await generateRandomBytes(256)

    // Encrypt data segments
    var encrypted_mail =
		await arweave.crypto.encrypt(mail_buf, key_buf)
    var encrypted_key =
		await window.crypto.subtle.encrypt(
		    {
		        name: 'RSA-OAEP'
		    },
		    pub_key,
		    key_buf
		)

    // Concatenate and return them
    return arweave.utils.concatBuffers([encrypted_key, encrypted_mail])
};

export const getPublicKey = async (address) => {
    var txid = await arweave.wallets.getLastTransactionID(address)

    if (txid == '') {
        return undefined
    }

    var tx = await arweave.transactions.get(txid)

    if (tx == undefined) {
        return undefined
    }

    var pub_key = arweave.utils.b64UrlToBuffer(tx.owner)

    var keyData = {
        kty: 'RSA',
        e: 'AQAB',
        n: tx.owner,
        alg: 'RSA-OAEP-256',
        ext: true
    }

    var algo = { name: 'RSA-OAEP', hash: { name: 'SHA-256' } }

    return await crypto.subtle.importKey('jwk', keyData, algo, false, ['encrypt'])
};

