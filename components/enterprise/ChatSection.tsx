'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../../app/enterprise/enterprise.module.css';

interface Message {
    id: number;
    sender: 'user' | 'agent';
    text?: string;
    time: string;
    product?: {
        name: string;
        price: string;
    };
}

export default function ChatSection() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'agent',
            text: '¡Hola! Bienvenido a Creatiendas 👋\n¿En qué puedo ayudarte hoy?',
            time: '14:20'
        }
    ]);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const handleShareProduct = (event: CustomEvent<{ name: string; price: string }>) => {
            const { name, price } = event.detail;
            const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });

            const newMessage: Message = {
                id: Date.now(),
                sender: 'user',
                text: 'Me interesa este producto:',
                time,
                product: { name, price }
            };

            setMessages(prev => [...prev, newMessage]);
            setTimeout(() => {
                alert(`📤 Producto compartido en el chat\n\n${name} - ${price}\n\nEl equipo de soporte te ayudará con tu compra.`);
            }, 300);
        };

        window.addEventListener('shareProduct', handleShareProduct as EventListener);
        return () => {
            window.removeEventListener('shareProduct', handleShareProduct as EventListener);
        };
    }, []);

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false });
        const newMessage: Message = {
            id: Date.now(),
            sender: 'user',
            text: inputText,
            time
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Auto-response
        setTimeout(() => {
            const responseMessage: Message = {
                id: Date.now() + 1,
                sender: 'agent',
                text: 'Gracias por tu mensaje. Un agente te responderá pronto ⚡',
                time: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
            };
            setMessages(prev => [...prev, responseMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') sendMessage();
    };

    return (
        <div className={styles.chatSection}>
            <div className={styles.chatHeader}>
                <div className={styles.chatUserInfo}>
                    <div className={styles.chatAvatar}>SA</div>
                    <div className={styles.chatUserDetails}>
                        <h3>Soporte Creatiendas</h3>
                        <div className={styles.chatStatus}>
                            <span className={styles.statusIndicator}></span>
                            <span>En línea</span>
                        </div>
                    </div>
                </div>
                <div className={styles.chatTabs}>
                    <button className={`${styles.chatTab} ${styles.chatTabActive}`}>💬 Chat</button>
                    <button className={styles.chatTab}>🤖 IA</button>
                </div>
            </div>

            <div className={styles.chatMessages}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`${styles.chatMessage} ${msg.sender === 'user' ? styles.chatMessageSent : ''}`}>
                        <div className={styles.messageAvatar}>{msg.sender === 'user' ? 'TÚ' : 'SA'}</div>
                        <div className={styles.messageContent}>
                            {msg.text && (
                                <div className={styles.messageBubble}>
                                    {msg.text.split('\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < msg.text!.split('\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            )}
                            {msg.product && (
                                <div className={styles.productShare}>
                                    <div className={styles.productShareImage}></div>
                                    <div className={styles.productShareInfo}>
                                        <div className={styles.productShareName}>{msg.product.name}</div>
                                        <div className={styles.productSharePrice}>{msg.product.price}</div>
                                    </div>
                                </div>
                            )}
                            <div className={styles.messageTime}>{msg.time}</div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className={styles.chatInput}>
                <div className={styles.inputWrapper}>
                    <input
                        type="text"
                        placeholder="Escribe un mensaje..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className={styles.btnAttach}>📎</button>
                    <button className={styles.btnSend} onClick={sendMessage}>➤</button>
                </div>
            </div>
        </div>
    );
}
