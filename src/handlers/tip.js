// APEX REVENUE - Tip Received Handler
// *** FULL REPLACEMENT – paste this into the "Tip Received" handler ***

var tokens = $tip.tokens;
var tipper = $tip.isAnon ? null : $user.username;

$kv.incr('session_total_tips', tokens);
$kv.incr('session_tip_count');
$kv.incr('all_time_tips', tokens);
$kv.incr('all_time_tip_count');

var currentHighest = $kv.get('session_highest_tip', 0);
if (tokens > currentHighest) {
  $kv.set('session_highest_tip', tokens);
  $kv.set('session_highest_tipper', tipper || 'Anonymous');
}

var tipperTotals = $kv.get('session_tipper_totals', {});
tipperTotals[tipper] = (tipperTotals[tipper] || 0) + tokens;
$kv.set('session_tipper_totals', tipperTotals);

var uniqueTippers = $kv.get('session_unique_tippers', []);
if (uniqueTippers.indexOf(tipper) === -1) {
  uniqueTippers.push(tipper);
  $kv.set('session_unique_tippers', uniqueTippers);
}

// Track all-time tipper totals for enter banners
var allTimeTotals = $kv.get('all_time_tipper_totals', {});
allTimeTotals[tipper] = (allTimeTotals[tipper] || 0) + tokens;
$kv.set('all_time_tipper_totals', allTimeTotals);

// —— Custom Announcement ————————————————————————————————————————————————————
var sessionTotal = $kv.get('session_total_tips', 0);
sendTipAnnouncement(tipper || 'Anonymous', tokens, sessionTotal, $tip.isAnon);

// —— Notify extension overlay ———————————————————————————————————————————————
$overlay.emit('apex_tip', {
  tokens: tokens,
  tipper: tipper,
  isAnon: $tip.isAnon,
  message: $tip.message,
  sessionTotal: sessionTotal,
  tipperTotal: tipperTotals[tipper] || tokens
});

$room.reloadPanel();
