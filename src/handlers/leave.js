// APEX REVENUE - User Leave Handler
// *** FULL REPLACEMENT – paste this into the "User Leave" handler ***

var username = $user.username;

$kv.incr('session_user_leaves');

// Notify extension if this was a tipper
var tipperTotals = $kv.get('session_tipper_totals', {});
if (tipperTotals[username]) {
  $overlay.emit('apex_user_leave', {
    username: username,
    tips: tipperTotals[username],
    isOwner: username === $room.owner
  });
}
