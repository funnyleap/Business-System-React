﻿import { Action, Reducer } from 'redux';
import { isEmpty, isNil } from 'lodash';
import { AppThunkAction } from './';
import apiErrorHandler from '../common/ApiErrorHandler';
import authService from '../components/api-authorization/AuthorizeService';
import AccountSubType from '../models/AccountSubType';
import AccountType from '../models/AccountType';
import AssetType from '../models/AssetType';

export interface LookupValuesState {
    isLoading: boolean;
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
}

interface RequestLookupValuesAction {
    type: 'REQUEST_LOOKUPS';
}

interface ReceiveLookupValuesAction {
    type: 'RECEIVE_LOOKUPS';
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
}

interface LookupsApiResponse {
    accountTypes: AccountType[];
    accountSubTypes: AccountSubType[];
    assetTypes: AssetType[];
}

type KnownAction = RequestLookupValuesAction | ReceiveLookupValuesAction;

export const actionCreators = {
    requestLookupValues: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();

        if (!isNil(appState?.lookups) &&
            !appState.lookups.isLoading &&
            (isEmpty(appState.lookups.accountTypes) || isEmpty(appState.lookups?.assetTypes))) {
            const accessToken = await authService.getAccessToken();

            fetch('api/lookups', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
                .then(response => {
                    if (!response.ok) {
                        apiErrorHandler.handleError(response);
                        return null;
                    }

                    return response.json() as Promise<LookupsApiResponse>
                })
                .then(data => {
                    if (!isNil(data)) {
                        const {
                            accountTypes,
                            accountSubTypes,
                            assetTypes,
                        } = data;

                        dispatch({
                            type: 'RECEIVE_LOOKUPS',
                            accountTypes,
                            accountSubTypes,
                            assetTypes,
                        });
                    }
                });

            dispatch({ type: 'REQUEST_LOOKUPS' });
        }
    },
}

const unloadedState: LookupValuesState = {
    isLoading: false,
    accountTypes: [],
    accountSubTypes: [],
    assetTypes: [],
};

export const reducer: Reducer<LookupValuesState> = (state: LookupValuesState | undefined, incomingAction: Action): LookupValuesState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    if (!isNil(action)) {
        switch (action.type) {
            case 'REQUEST_LOOKUPS':
                return {
                    ...state,
                    isLoading: true
                };

            case 'RECEIVE_LOOKUPS':
                return {
                    ...state,
                    accountTypes: action.accountTypes,
                    accountSubTypes: action.accountSubTypes,
                    assetTypes: action.assetTypes,
                    isLoading: false
                };
        }
    }

    return state;
}