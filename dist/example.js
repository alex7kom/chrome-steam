var bot = new Steam.SteamClient();

bot.on('debug', function (msg) {
  console.log(msg);
});

bot.on('error', function (msg) {
  console.log(msg);
});

bot.on('loggedOn', function() {
  console.log('Logged in!');
  bot.setPersonaState(Steam.EPersonaState.Online);
});

bot.on('message', function(source, message, type, chatter) {
  console.log('Received message: ' + message);
  if (message == 'ping') {
    bot.sendMessage(source, 'pong', Steam.EChatEntryType.ChatMsg);
  }
});

bot.on('sentry', function(sentry) {
  chrome.storage.local.set({
    shaSentryfile: JSON.stringify(sentry.data)
  });
});

chrome.storage.local.get(['accountName', 'password', 'shaSentryfile'], function (items) {
  if (!items.accountName || !items.password || !items.shaSentryfile) {
    return console.log('Use `logOn(accountName, password)` to login');
  }

  bot.logOn({
    accountName: items.accountName,
    password: items.password,
    shaSentryfile: new Steam.Buffer(JSON.parse(items.shaSentryfile))
  });
});

window.logOn = function (accountName, password) {
  bot.logOn({
    accountName: accountName,
    password: password
  });

  bot.once('error', function (e) {
    if (e.cause != 'logonFail') {
      throw e;
    }
    if (e.eresult == Steam.EResult.InvalidPassword) {
      throw new Error('Your username and/or password is invalid. Try `logOn(accountName, password)`.');
    } else if (e.eresult == Steam.EResult.AccountLogonDenied) {
      console.log('Your Steam Guard code should have been emailed to you.');
      console.log('Use `guard(authCode)` to continue');
      chrome.storage.local.set({
        accountName: accountName,
        password: password
      });
    } else {
      throw e;
    }
  });
};

window.guard = function (authCode) {
  chrome.storage.local.get(['accountName', 'password'], function (items) {
    if (!items.accountName || !items.password) {
      return console.log('Use `logOn(accountName, password)` to login');
    }

    bot.logOn({
      accountName: items.accountName,
      password: items.password,
      authCode: authCode
    });

    bot.once('error', function (e) {
      if (e.cause != 'logonFail') {
        throw e;
      }
      if (e.eresult == Steam.EResult.AccountLogonDenied) {
        return console.log('Your Steam Guard code is invalid. Try `logOn(accountName, password)` again.');
      } else {
        throw e;
      }
    });
  });
};