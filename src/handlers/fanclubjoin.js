// APEX REVENUE - Fanclub Join Handler
// *** FULL REPLACEMENT – paste this into the "Fanclub Join" handler ***

var isNew = $fanclub.isNew;
var username = $user.username;

$kv.incr('all_time_fanclub_joins');

// —— Fanclub Banner ———————————————————————————————————————————————————————
sendFanclubBanner(username, isNew);

// Send thank you whisper
apexWhisper(username, 'Thanks for joining the Fan Club! You now have access to exclusive content and perks.');
