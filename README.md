<h1 align="center">Gdrive MultiFunction Telegram Bot Cloudflare</h1>

<h2 align="center">This is a Telegram bot that allows users to perform  Various Functions.</h2>

### ⭕Features
- Searching for Files within Users Google Drive. [✅]
- Cloning any File to Users Shared Drive Using Drive File URL. [✅]
- Share Files to various File Sharer Using the Drive Link. [✘]
- Generate QR codes for any link or text. [✘]
- Generate short links from any ads shortner API. [✘]
- Generate short links without ads. [✘]
- Adding More features soon. Suggestions are appreciated 💯


### ⭕How to Deploy
- **Creating a Cloudflare Account:**
  - Navigate to the Cloudflare website and sign up for an account if you haven't already.
  - Follow the instructions to verify your email and set up your account.
  - Once logged in, you'll have access to the Cloudflare dashboard.

- **Creating a KV Namespace named as BOT:**
  - In the Cloudflare dashboard, go to the Workers section.
  - Click on "KV" from the sidebar menu.
  - Click on "Create Namespace" and give it a name, e.g., "BOT".
  - Configure any additional settings as needed and click "Create".

- **Creating a Worker:**
  - In the Cloudflare dashboard, go to the Workers section.
  - Click on "Create Worker".
  - Write your Worker script or upload an existing one.
  - Customize the settings and route for your Worker.
  - Click "Save and Deploy" to deploy your Worker.

- **Binding KV Namespace to Worker:**
  - While in the Worker editor, navigate to the "KV" tab.
  - Select the KV Namespace you created earlier, e.g., "BOT".
  - Configure any bindings or routes as necessary.
  - Save the changes to bind the KV Namespace to your Worker.

- **Setting up Webhook for Telegram:**
  - Obtain your Telegram Bot API Token by creating a new bot using the BotFather.
  - Write your Worker script to handle incoming webhook requests from Telegram.
  - Deploy your Worker script, ensuring it listens for webhook requests on the desired route.
  - Configure the webhook URL in your Telegram Bot settings to point to your Cloudflare Worker route.



### ⭕Screenshots
<p align="center">
    <img width="500" src="https://github.com/ShlokDhakrey/Gdrive-search-clone-TG-bot-Cloudflare/assets/127608696/d18c61bb-ddf2-470d-95f4-17b2cc00a51e" alt="Material Bread logo">
 <img width="500" src="https://github.com/ShlokDhakrey/Gdrive-search-clone-TG-bot-Cloudflare/assets/127608696/d18c61bb-ddf2-470d-95f4-17b2cc00a51e" alt="Material Bread logo"></p>


https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://your.domain.workers.dev/
