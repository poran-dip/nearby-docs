# Nearby Docs

**Nearby Docs** was made as a feature module for **[Doc Connect](https://github.com/poran-dip/doc-connect)**. This is a **temporary repository** and will soon be **archived**; the functionalities will be added over to **Doc Connect** itself. 

For those unaware, **Doc Connect** was my **first ever full-stack project**, and also my **first ever hackathon**. [You can follow the entire story over here](https://github.com/poran-dip/doc-connect/README.md). 

You can view what we submitted back then over on the **[`hackathon-legacy`](https://github.com/poran-dip/nearby-docs/tree/hackathon-legacy) branch** and get a glimpse at my dev journey. However, if you want to try it out yourself, maybe mess around with **`Google Maps JS API`**, I would recommend just using the `main` branch.

### Setup instructions

- Grab a [Google Maps API Key](https://developers.google.com/maps)

- Clone the repository and install dependencies

```bash
git clone https://github.com/poran-dip/nearby-docs.git
cd nearby-docs
npm install
```

- Create a `.env` file in root directory (`nearby-docs/.env`) and paste the following (make sure there's no spaces around the equal sign)

```.env
GOOGLE_MAPS_API_KEY=your_api_key_here
```

- Start the server

```bash
npm run start     # Or node server.js
```

### Tech Stack

Just as a recap, this module utilises:

- Express
- Google Maps API
- Dotenv

### Wrapping Up

That's about it, do check out **Doc Connect**, thanks for dropping by, and peace!

— Poran Dip