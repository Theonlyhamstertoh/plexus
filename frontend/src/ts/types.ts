export type SessionConnectHandler = (e: Event) => any;
export type SessionMessageHandler = <T>(e: MessageEvent<T>) => any;
export type SessionCloseHandler = (e: Event) => any;
export type SessionSendMessage = <T>(data: T) => void;
