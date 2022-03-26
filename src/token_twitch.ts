const client_id = import.meta.env.VITE_CLIENT_ID;

if (location.hash) {
    console.log(`トークン情報は`);
    console.log(`${location.hash}`);
    console.log(`だよ！`);
}

const anchor = document.createElement('a');
anchor.textContent = 'Twitch Auth';
anchor.href = `https://id.twitch.tv/oauth2/authorize?client_id=${client_id}&redirect_uri=http://localhost:3000/token_twitch.html&response_type=token&scope=channel:read:redemptions%20chat:read%20chat:edit`;
document.body.appendChild(anchor);
