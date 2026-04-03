// APEX REVENUE - Chat Message Handler
// *** FULL REPLACEMENT — paste this into the "Chat Message" handler ***

(function() {
  var parts = $message.body.split(' ');
  var command = parts[0];
  var sub = parts[1] || '';
  var username = $user.username;
  var isOwner = $user.isOwner;
  var isMod = $user.isMod;

  if (command !== '/apex') return;

  // Only owner and mods can use commands
  if (!isOwner && !isMod) return;

  if (sub === 'help') {
    sendHelpMenu(username, isOwner);
  } else if (sub === 'download' || sub === 'dl') {
    sendDownloadInfo(username);
  } else if (sub === 'install' || sub === 'setup') {
    sendInstallGuide(username);
  } else if (sub === 'stats') {
    var stats = getSessionStats();
    apexWhisper(username, formatStats(stats));
  } else if (sub === 'top' || sub === 'leaderboard') {
    var limit = parseInt(parts[2]) || 5;
    var topList = getTopTippers(limit);
    if (topList.length === 0) {
      apexWhisper(username, 'No tips yet this session.');
    } else {
      var lines = topList.map(function(t, i) {
        return (i + 1) + '. ' + t.username + ' — ' + t.total + ' tk';
      });
      apexWhisper(username, 'Top Tippers:\n' + lines.join('\n'));
    }
  } else if (sub === 'announce') {
    sendRoomAnnouncement();
  } else if (sub === 'onboard') {
    $kv.set('onboarded_users', {});
    apexWhisper(username, 'Onboarding history cleared — all users will be re-welcomed.');
  } else if (sub === 'reset') {
    $kv.set('session_total_tips', 0);
    $kv.set('session_tip_count', 0);
    $kv.set('session_highest_tip', 0);
    $kv.set('session_highest_tipper', '');
    $kv.set('session_tipper_totals', {});
    $kv.set('session_unique_tippers', []);
    resetGoalTracking();
    $room.reloadPanel();
    apexWhisper(username, 'Session stats + goal tracking reset.');
  } else if (sub === 'on' || sub === 'start') {
    handleExtensionOn(username);
  } else if (sub === 'off' || sub === 'stop') {
    handleExtensionOff(username);
  } else if (sub === 'status') {
    apexWhisper(username, getExtensionStatus());
    // ── New announcement/banner commands ─────────────────────────────────────
  } else if (sub === 'banner') {
    var bannerText = parts.slice(2).join(' ');
    if (bannerText) {
      sendThemedBanner(bannerText);
      apexWhisper(username, 'Banner sent.');
    } else {
      apexWhisper(username, 'Usage: /apex banner <message>');
    }
  } else if (sub === 'announce-custom' || sub === 'ac') {
    var announceText = parts.slice(2).join(' ');
    if (announceText) {
      sendThemedAnnouncement(announceText);
      apexWhisper(username, 'Announcement sent.');
    } else {
      apexWhisper(username, 'Usage: /apex ac <message>');
    }
  } else if (sub === 'goal') {
    if (!$settings.tipGoalEnabled) {
      apexWhisper(username, 'Tip goal is not enabled in settings.');
    } else {
      var goalAmt = $settings.tipGoalAmount || 0;
      var current = $kv.get('session_total_tips', 0);
      var pct = goalAmt > 0 ? Math.floor((current / goalAmt) * 100) : 0;
      apexWhisper(username, 'Goal: ' + current + '/' + goalAmt + ' tokens (' + pct + '%)');
    }
  } else if (sub === 'goal-announce') {
    if ($settings.tipGoalEnabled) {
      var ga = $settings.tipGoalAmount || 0;
      var gc = $kv.get('session_total_tips', 0);
      var gp = ga > 0 ? Math.floor((gc / ga) * 100) : 0;
      sendThemedAnnouncement('Goal progress: ' + gc + '/' + ga + ' tokens (' + gp + '%)');
    }
  } else if (sub === 'theme') {
    apexWhisper(username, 'Current theme: ' + ($settings.announceTheme || 'Apex Purple') +
      ' | Announcements: ' + ($settings.announcementsEnabled ? 'ON' : 'OFF') +
      ' | Banners: ' + ($settings.bannersEnabled ? 'ON' : 'OFF'));
  } else {
    apexWhisper(username, 'Unknown command. Type /apex help for available commands.');
  }
})();
