addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event).catch(
    (err) => new Response("Report this page when asked at the time of support... ==> " + err.stack, { status: 500 })
  )
  );
});

const authConfig = {
  "client_id": "746239575955-c4d2o1ahg4ts6ahm3a5lh5lp9g8m15h4.apps.googleusercontent.com", 
  "client_secret": "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",  
  "refresh_token": "", // Get your from https://bdi-generator.hashhackers.com/
  "FolderID":"0AIVrGam-09vXUk9PVA",  // Folder ID to clone files
  "IndexURL":"https://shlok-dhakrey.tg-rss.workers.dev",  // Index URL For sharing Cloned Files 
  "bot_token":"704778",  // Your token from @Botfather
  "Owner_Github_Link":"https://github.com/ShlokDhakrey",
  "Owner_Telegram_Username":"dhakreyy",
  "authorised_chat_id":"-1001948332733"
}

async function fetchAccessToken() {
  const formData = new URLSearchParams();
  formData.append("client_id", authConfig.client_id);
  formData.append("client_secret", authConfig.client_secret);
  formData.append("refresh_token", authConfig.refresh_token);
  formData.append("grant_type", "refresh_token");

  const loltoken = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: formData
  });
  const res = await loltoken.json();
  return res.access_token
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}


async function handleRequest(request, event) {
  try {
    const data = await request.json();

    if (data.message && data.message.text && request.method === 'POST') {
      const chatId = authConfig.authorised_chat_id;
      const messageId = data.message.message_id;
      const messageText = data.message.text;
      const usernaame = data.message.from.username;
      if (messageText.startsWith('/start')) {
        const inlineButtons = [
          [{ text: 'GitHub Repo', url: authConfig.Owner_Github_Link }],
          [{ text: 'Owner', url: 'https://t.me/'+authConfig.Owner_Telegram_Username }]
        ];

        await sendMessage(chatId, messageId, "- Hosted on Cloudflare", usernaame, inlineButtons);
      } else if (messageText.startsWith('/search')) {
        const keyword = messageText.split(' ').slice(1).join(' ');
        if (!keyword) {
          await sendMessage(chatId, messageId, "Search query empty!", usernaame);
        } else {
          const access_token = await fetchAccessToken();
          const searchres = await searchdrive(keyword, access_token);
          if (searchres.files.length === 0) {
            await sendMessage(chatId, messageId, "No files found", usernaame);
          } else {
            const message = searchres.files.map(file => {
              return `\n<a href="https://drive.google.com/open?id=${file.id}">${file.name}</a>\nType : ${file.mimeType}\nSize : ${formatFileSize(file.size)}`;
            }).join('\n');
            await sendMessage(chatId, messageId, message, usernaame);
          }
        }
      }
      else if (messageText.startsWith('/copy')) {
        const keyword = messageText.split(' ').slice(1).join(' ');
        if (!keyword) {
          await sendMessage(chatId, messageId, "File ID Empty to clone!", usernaame);
        } else {
          const access_token = await fetchAccessToken()
          const driveID = extractFileId(keyword);
          const copyres = await copyItemById(driveID, access_token);
          if (copyres.error) {
            await sendMessage(chatId, messageId, "Error Occured While Cloning File \n\nError : " + copyres.error.message, usernaame);
          } else {
            await sendMessage(chatId, messageId, "Cloning SuccessFull \n\nFile Name : " + copyres.name + "\nLink : "+authConfig.IndexURL+"/0:/" + copyres.name, usernaame);

          }
        }

      }
      else {
        await sendMessage(chatId, messageId, "\n\nInvalid Command\n\nContact Admin --> @"+authConfig.Owner_Telegram_Username, usernaame);
      }
    }

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response("An error occurred.", { status: 500 });
  }
}

async function sendMessage(chatID, replyID, messageText, username, inlineButtons = null) {
  try {
    const requestBody = {
      chat_id: chatID,
      reply_to_message_id: replyID,
      text: `Hello @${username}, \n\n${messageText}`,
      disable_web_page_preview: true,
      parse_mode: 'HTML'
    };

    if (inlineButtons) {
      requestBody.reply_markup = JSON.stringify({
        inline_keyboard: inlineButtons
      });
    }

    await fetch('https://api.telegram.org/bot' + authConfig.bot_token + '/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
  } catch (err) {
    console.error("Error sending message:", err);
  }
}


async function searchdrive(keyword, access_token) {
  const params = {
    corpora: "allDrives",
    includeItemsFromAllDrives: true,
    supportsAllDrives: true,
    q: "trashed=false AND mimeType != 'application/vnd.google-apps.shortcut' and mimeType != 'application/vnd.google-apps.document' and mimeType != 'application/vnd.google-apps.spreadsheet' and mimeType != 'application/vnd.google-apps.form' and mimeType != 'application/vnd.google-apps.site' AND name != '.password' AND (name contains '" + keyword + "')",
    pageSize: 50,
    fields: "nextPageToken, files(id, driveId, name, mimeType, size, modifiedTime)",
    orderBy: "folder, name, modifiedTime desc"
  };

  const url = new URL("https://www.googleapis.com/drive/v3/files");
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": "Bearer " + access_token
    }
  });

  const data = await response.json();
  return data
}

function extractFileId(link) {
  const match = link.match(/\/(file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
  return match ? match[2] : null;
}

async function copyItemById(id, access_token, resourcekey = null, user_folder_id = authConfig.FolderID, headers = {}) {
  let url = `https://www.googleapis.com/drive/v3/files/${id}/copy?fields=id,name,mimeType&supportsAllDrives=true`;
  headers["authorization"] = "Bearer " + access_token;
  headers["Accept"] = "application/json";
  headers["Content-Type"] = "application/json";
  headers["X-Goog-Drive-Resource-Keys"] = id + "/" + resourcekey;
  let json = {
    parents: [user_folder_id]
  }
  let res
  for (let i = 0; i < 3; i++) {
    res = await fetch(url, {
      "method": "POST",
      "headers": headers,
      "body": JSON.stringify(json)
    });
    if (res.ok) {
      break;
    }
    await sleep(100 * (i + 1));
  }
  const data = await res.json();
  console.log(data);
  return data;
}

async function sleep(ms) {
  return new Promise(function (resolve, reject) {
    let i = 0;
    setTimeout(function () {
      console.log('sleep' + ms);
      i++;
      if (i >= 2) reject(new Error('i>=2'));
      else resolve(i);
    }, ms);
  })
}
