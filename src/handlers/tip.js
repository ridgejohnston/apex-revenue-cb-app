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

// ── v0.2.0: Give Control Activation ─────────────────────────────────────────
// Checks if the tip amount matches the Give Control trigger
// and activates a real-time control session with OTP
if ($settings.giveControlEnabled && tokens === parseInt($settings.giveControlTokens || '0')) {
    var controlDuration = parseInt($settings.giveControlDuration || '60');
    var controlUrl = $settings.controlPageUrl || 'apexrevenue.works/control';

    // Generate 14-char OTP
    var otpChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var otp = '';
    for (var ci = 0; ci < 14; ci++) {
        otp += otpChars.charAt(Math.floor(Math.random() * otpChars.length));
    }

    // Store active session
    $kv.set('active_control_session', {
        otp: otp,
        fan: tipper || 'Anonymous',
        duration: controlDuration,
        startedAt: Date.now()
    });

    // Hidden message for Chrome Extension to intercept
    $room.sendNotice('[APEX_CONTROL_SESSION]' + JSON.stringify({
        otp: otp,
        fan: tipper || 'Anonymous',
        duration: controlDuration,
        room: $room.owner
    }), {
        toUser: $room.owner,
        color: '#000000',
        bgColor: '#000000'
    });

    // Public room announcement
    sendThemedBanner(
        '🎮 ' + (tipper || 'Anonymous') + ' just bought GIVE CONTROL!\n'
        + 'They now control the toy for ' + controlDuration + ' seconds! 🔥'
    );

    // Private whisper to winner with control URL
    $room.sendNotice(
        '🎮 YOU HAVE GIVE CONTROL!\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + 'Visit: ' + controlUrl + '?token=' + otp + '\n'
        + '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'
        + controlDuration + ' seconds of control. Session expires in 5 min.',
        {
            toUser: tipper,
            color: '#FF6B00',
            bgColor: '#000000',
            fontWeight: 'bold'
        }
    );

    // Auto-end callback
    $callback.create('endGiveControl', controlDuration + 2);
}

$room.reloadPanel();
