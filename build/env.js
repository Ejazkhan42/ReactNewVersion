const Hostname = window.location.hostname;
const protocol = window.location.protocol;
const port = window.location.port;
window.env = {
            AP: `https://${Hostname}/api`,
            WS: `wss://${Hostname}443`,
};
