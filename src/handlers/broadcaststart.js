// APEX REVENUE - Broadcast Start Handler
// *** FULL REPLACEMENT – paste this into the "Broadcast Start" handler ***

// Reset session counters
$kv.set('session_total_tips', 0);
$kv.set('session_tip_count', 0);
$kv.set('session_highest_tip', 0);
$kv.set('session_highest_tipper', '');
$kv.set('session_tipper_totals', {});
$kv.set('session_unique_tippers', []);
$kv.set('session_user_enters', 0);
$kv.set('session_user_leaves', 0);

// Reset goal and milestone tracking
resetGoalTracking();

$room.reloadPanel();

// Start recurring announcement timer (existing)
if ($settings.autoAnnounceEnabled) {
  var interval = $settings.announceIntervalMinutes || 30;
  $callback.create('auto_announce', interval * 60);
}

// —— Start recurring custom banner timer ——————————————————————————————————
startRecurringBannerTimer();

// Notify extension
apexNotice('Apex Revenue is active. Type /apex help for commands.');

$room.owner && apexWhisper($room.owner, 'Apex Revenue v1.1.0 started. Announcements: ' +
  ($settings.announcementsEnabled ? 'ON' : 'OFF') + ' | Banners: ' +
  ($settings.bannersEnabled ? 'ON' : 'OFF'));
