// APEX REVENUE - Callback Handler
// *** FULL REPLACEMENT – paste this into the "Callback" handler ***

if ($callback.label === 'auto_announce') {
  // Existing periodic extension announcement
  sendRoomAnnouncement();
  $room.reloadPanel();
} else if ($callback.label === 'recurring_banner') {
  // Recurring custom banner
  sendRecurringBanner();
  $room.reloadPanel();

// ── v0.2.0: Give Control & Digital Sync Callbacks ───────────────────────────
} else if ($callback.label === 'endGiveControl') {
  // Auto-end Give Control session when timer expires
  var session = $kv.get('active_control_session', null);
  if (session) {
    sendThemedAnnouncement('🎮 Give Control session ended. Thanks ' + session.fan + '! 🔥');
    $kv.set('active_control_session', null);
  }
} else if ($callback.label === 'syncAnnounce') {
  // Periodic Digital Sync announcement
  if ($settings.syncEnabled) {
    var syncUrl = $settings.syncPageUrl || 'apexrevenue.works/sync';
    var roomSlug = $room.owner || '';
    sendThemedAnnouncement(
        '🔗 DIGITAL SYNC — Sync your toy and feel every vibe in real time!\n'
        + 'Visit: ' + syncUrl + '?room=' + roomSlug + ' | Type /apex sync for setup.'
    );
    // Schedule next announcement
    var interval = parseInt($settings.syncAnnounceInterval || '15');
    if (interval > 0) {
      $callback.create('syncAnnounce', interval * 60);
    }
  }
}
