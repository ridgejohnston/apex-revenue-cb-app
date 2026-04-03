// APEX REVENUE - Broadcast Stop Handler
// *** FULL REPLACEMENT – paste this into the "Broadcast Stop" handler ***

$callback.cancel('auto_announce');
$callback.cancel('recurring_banner');

var stats = getSessionStats();

if ($room.owner) {
  apexWhisper($room.owner, 'Broadcast ended. ' + formatStats(stats));
}

// Persist session for the extension to pick up
$kv.set('last_broadcast_stats', {
  total_tips: stats.totalTips,
  tip_count: stats.tipCount,
  highest_tip: stats.highestTip,
  unique_tippers: stats.uniqueTippers,
  enters: stats.enters
});
