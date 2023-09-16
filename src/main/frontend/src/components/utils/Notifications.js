import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EventSourcePolyfill } from "event-source-polyfill";
import { getAuthToken } from "../../hoc/request";
import { notification } from "antd";

function Notifications() {
    const nickName = useSelector(state => state.auth.userNickName);
    //const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        console.log("Attempting to connect to SSE...");
        console.log("nickName : ", nickName);
        const authToken = getAuthToken(); // Retrieve JWT token
        const eventSource = new EventSourcePolyfill(`http://localhost:9090/sse/subscribe/${nickName}`, {
            headers: {
                Authorization: `Bearer ${authToken}`, // Include JWT token in headers
            },
            withCredentials: true,
            heartbeatTimeout: 3000,
        });

        // 백엔드의 sendToClient함수의 send의 인자인 .name("sse")와 연관됨.
        eventSource.addEventListener('sse', event => {
            console.log("event", event);
            // 서버에서 온 알림을 표시합니다.
            const newMessage = event.data;
            
            console.log('newMessage : ', event.data);
            setMessages(prevMessages => [...prevMessages, newMessage]);

            // antd의 notification을 사용하여 알림을 표시
            notification.info({
                message: "New Notification",
                description: newMessage,
                style: {
                    backgroundColor: '#C0FFFF'
                },
            });
        });

        eventSource.onopen = () => {
            console.log("SSE connection opened.");
            console.log('eventSource',eventSource);
        };

        eventSource.onmessage = (event) => {
            try {
                console.log("SSE message received:", event.data);
                const newMessage = event.data;
                setMessages(prevMessages => [...prevMessages, newMessage]);
            } catch (error) {
                console.error("Error in onmessage:", error);
            }
        };

        eventSource.onerror = (error) => {
            console.error("SSE error:", error);
        };

        return () => {
            eventSource.close();
            console.log("SSE connection closed.");
        };
    }, [nickName]);

    return (
        <div>
            {/** message && <p>{message}</p> */}
            {messages && messages.length > 0 ? (
                messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))
            ) : (
                <p>
                    messages are empty!
                </p>
            )}
        </div>
    );

}

export default Notifications;