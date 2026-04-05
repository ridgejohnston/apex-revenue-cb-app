// APEX REVENUE - App Start Handler
// *** FULL REPLACEMENT – paste this into the "App Start" handler ***

// Reset session KV state
$kv.set('session_total_tips', 0);
$kv.set('session_tip_count', 0);
$kv.set('session_highest_tip', 0);
$kv.set('session_highest_tipper', '');
$kv.set('session_tipper_totals', {});
$kv.set('session_unique_tippers', []);
$kv.set('session_user_enters', 0);
$kv.set('session_user_leaves', 0);
$kv.set('apex_app_running', true);

// Reset goal and milestone tracking
resetGoalTracking();

// Initialize all-time tipper totals if not present
if (!$kv.get('all_time_tipper_totals', null)) {
  $kv.set('all_time_tipper_totals', {});
}

// Auto-announce timer
if ($settings.autoAnnounceEnabled) {
  var interval = $settings.announceIntervalMinutes || 30;
  $callback.create('auto_announce', interval * 60);
}

// —— Start recurring custom banner timer ——————————————————————————————————
startRecurringBannerTimer();

// ── v0.2.0: Initialize Give Control session state ───────────────────────────
$kv.set('active_control_session', null);

// ── v0.2.0: Start Digital Sync recurring announcements ──────────────────────
if ($settings.syncEnabled) {
  var syncInterval = parseInt($settings.syncAnnounceInterval || '15');
  if (syncInterval > 0) {
    $callback.create('syncAnnounce', syncInterval * 60);
  }
}

// Extension auto-control
if ($settings.extensionAutoControl) {
  sendExtensionSignal('start', 'app_start');
}

apexNotice('Apex Revenue v2.0.0 loaded. Type /apex help for commands.');

if ($room.owner) {
  apexWhisper($room.owner, 'App started. Theme: ' + ($settings.announceTheme || 'Apex Purple') +
    ' | Announcements: ' + ($settings.announcementsEnabled ? 'ON' : 'OFF') +
    ' | Banners: ' + ($settings.bannersEnabled ? 'ON' : 'OFF') +
    ' | Tip Goal: ' + ($settings.tipGoalEnabled ? $settings.tipGoalAmount + ' tk' : 'OFF'));
}
