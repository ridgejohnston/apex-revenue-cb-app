// APEX REVENUE - App Stop Handler
// *** FULL REPLACEMENT – paste this into the "App Stop" handler ***

var autoControl = $settings.extensionAutoControl;

// Cancel all callbacks
$callback.cancel('auto_announce');
$callback.cancel('recurring_banner');

// Send session summary to owner
var stats = getSessionStats();
var summary = 'Session ended. ' + formatStats(stats);
if ($room.owner) {
  apexWhisper($room.owner, summary);
}

// Save session stats snapshot
$kv.set('last_session_summary', {
  total_tips: stats.totalTips,
  tip_count: stats.tipCount,
  highest_tip: stats.highestTip,
  highest_tipper: stats.highestTipper,
  unique_tippers: stats.uniqueTippers,
  enters: stats.enters,
  leaves: stats.leaves,
  ended_at: new Date().toISOString()
});

// Extension auto-control
if (autoControl) {
  sendExtensionSignal('stop', 'app_stop');
}

$kv.set('apex_app_running', false);
