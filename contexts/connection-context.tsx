import React from 'react';
import { createContext, useReducer, Reducer, useEffect } from "react";
import NetInfo from "@react-native-community/netinfo";

export interface IConnectionContext {
    isConnected: boolean;
}

export enum CONNECTION_ACTIONS {
    SET_CONNECTED = '[Set Connected]',
    SET_DISCONNECTED = '[Set DiConnected]',
}

export interface IAction {
    type: CONNECTION_ACTIONS;
}

export interface ISetConnectedAction extends IAction { }
export interface ISetDisConnectedAction extends IAction { }

export type IConnectionActions =
    | ISetConnectedAction
    | ISetDisConnectedAction;

export const defaultConnectionContextValue: IConnectionContext = {
    isConnected: true
};

export const ConnectionContext = createContext<[IConnectionContext, React.Dispatch<IConnectionActions>]>
    ((null as unknown) as [IConnectionContext, React.Dispatch<IConnectionActions>]);

export const ConnectionContextProvider = ({ children }: { children: Element }) => {
    const [state, dispatch] = useReducer<Reducer<IConnectionContext, IConnectionActions>>((state, action) => {
        switch (action.type) {
            case CONNECTION_ACTIONS.SET_CONNECTED:
                return { isConnected: true }
            case CONNECTION_ACTIONS.SET_DISCONNECTED:
                return { isConnected: false };
            default:
                return state;
        }
    }, defaultConnectionContextValue);

    useEffect(() => {               
        const unsubscribe = NetInfo.addEventListener(state => {            
            dispatch({
                type: state.isConnected ? CONNECTION_ACTIONS.SET_CONNECTED : CONNECTION_ACTIONS.SET_DISCONNECTED
            });
        });
        return () => unsubscribe();
    }, []);

    return (
        <ConnectionContext.Provider value={[state, dispatch]}>
            {children}
        </ConnectionContext.Provider>
    )
};
