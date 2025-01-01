import React, { Component } from "react";
import RFB from "@novnc/novnc/lib/rfb"; // Adjust the import path as per your setup
import { CircularProgress, Card, CardMedia } from "@mui/material";

export default class VncScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false, // Initial loading state
            connectionError: false, // Connection error state
            errorMessage: "",
            reason:"", // Store detailed error messages
        };
        this.rfb = null;
    }

    static resizeVnc(rfb) {
        if (rfb) {
            rfb.resizeSession = true;
            rfb.scaleViewport = true;
        }
    }

    connection(status) {
        this.props.onUpdateState(status);
    }

    onVNCDisconnect = (event) => {
        console.log("Disconnect",event);
        const error = event.detail && event.detail.clean === false;
        const errorMessage = error
            ? `Failed when connecting: ${event.detail.reason || "Connection closed"}`
            : "Disconnected successfully.";
        console.error(errorMessage);

        this.setState({
            connectionError: error,
            loading: false,
            errorMessage: errorMessage,
        });
        this.connection("disconnected");
    };

    onVNCConnect = () => {
        console.log("Connected to VNC server successfully.");
        this.connection("connected");
        this.setState({ loading: false, connectionError: false, errorMessage: "",reason:"" });
    };

    onSecurityFailure = (event) => {
        const errorMessage = `Failed when connecting: Security failure`;
        const reason = event.detail.reason;

        console.error(errorMessage, event);
        this.setState({ connectionError: true, loading: false, errorMessage, reason: reason });
    };

    componentDidMount() {
        const { session } = this.props;
        if (session) {
            this.setState({ loading: true }); // Start loading indicator
            this.connectRFB(session);
        }
    }

    componentDidUpdate(prevProps) {
        const { session } = this.props;
        if (session && session !== prevProps.session) {
            this.disconnect(this.rfb);
            this.setState({ loading: true }); // Start loading indicator
            this.connectRFB(session);
        }
    }

    componentWillUnmount() {
        this.disconnect(this.rfb);
    }

    connectRFB = (session) => {
        const { SELENOID_URL } = this.props;
        const selenoid = new URL(SELENOID_URL);
        const protocol = selenoid.protocol;
        const port = selenoid.port;
        const hostname = selenoid.hostname;
        this.disconnect(this.rfb);
        this.rfb = this.createRFB(hostname, port, session, this.isSecure(protocol));
    };

    createRFB(hostname, port, session, secure) {
        const { SELENOID_PASSWORD } = this.props;

        const rfb = new RFB(
            this.canvas,
            `${secure ? "wss" : "ws"}://${hostname}:${port}/vnc/${session}`,
            {
                credentials: {
                    password: SELENOID_PASSWORD,
                },
            }
        );

        rfb.addEventListener("connect", this.onVNCConnect);
        rfb.addEventListener("disconnect", this.onVNCDisconnect);
        rfb.addEventListener("securityfailure", this.onSecurityFailure);

        rfb.scaleViewport = true;
        rfb.resizeSession = true;
        rfb.viewOnly = true;

        // Add WebSocket error listener for detailed logging
        rfb._sock._websocket.addEventListener("close", (event) => {
            const message = `Failed when connecting: Connection closed (code: ${event.code}, reason: ${event.reason || "No reason provided"})`;
            console.error("rfb.js:", message);
        });

        return rfb;
    }

    disconnect(rfb) {
        if (rfb && rfb._rfb_connection_state && rfb._rfb_connection_state !== "disconnected") {
            rfb.disconnect();
        }
    }

    isSecure(link) {
        return link === "https:";
    }

    render() {
        const { loading, connectionError, errorMessage,reason } = this.state;
        const reasonmessage = reason? "\n\t Reason: "+reason :"";
        if(errorMessage==="Failed when connecting: Connection closed"){
            sessionStorage.setItem('browsers_id', JSON.stringify([]));
            sessionStorage.setItem('excelData', JSON.stringify([]));
            sessionStorage.setItem('servers', JSON.stringify({}));
        }
        return (
            <Card
                sx={{
                    display: 'flex',
                    backgroundColor: 'rgb(48, 54, 60)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    position: 'relative',
                }}
            >
                <CardMedia
                    sx={{ width: "100%", height: "100%" }}
                    ref={(screen) => {
                        this.canvas = screen;
                        VncScreen.resizeVnc(this.rfb);
                    }}
                />

                {loading && (
                    <CircularProgress
                        style={{
                            position: "absolute",
                        }}
                        color="secondary"
                        size={200}
                    />
                )}

                {connectionError && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "rgba(255, 0, 0, 0.8)",
                            color: "white",
                            padding: "20px",
                            borderRadius: "5px",
                            textAlign: "center",
                        }}
                    >
                        {reasonmessage || errorMessage   || "Connection Error! Please try again."}
                    </div>
                )}
            </Card>
        );
    }
}
