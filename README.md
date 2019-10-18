# Weave Reminders

This is a permaweb app that allows users to safely store and receive reminders for future events. 

Once mined in the arweave blockchain, the reminders are securely stored in the permaweb and can only be accessed via the user's arweave wallet. 

This therefore means a user can store confidential information in these reminders without few of their privacy being compromised and since arweave is decentralized, this also means the risk of losing this information in the future is non-existent.


# Usage

1. Clone this repo and from its root run the following two commands,
-`yarn install` to install the required dependencies
-`yarn serve` to run the permaweb app.

# How it works

To use this permaweb app simply enter & save a reminder i.e. `Buy groceries` in a future datetime and continue with your work. Once that future datetime is in the range of 60 seconds, the dApp will display it plus a notification sound alerting you to the reminder. Simple as apple pie :)

# Future Roadmap

Since this is an MVP, I would like to continue working on it and add the following features.

- Pagination for the reminder tables
- Ability to replay and old reminder in the future again
- Ability to archive old reminders