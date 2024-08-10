import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { giftCardPath } from '../constants/api.constants';

import { GetGiftCardsParam } from '../models/params/Gift-Card.Param';

import {
	AddGiftCardRequest,
	UpdateGiftCardRequest,
} from '../models/requests/GIft-Card.Request';

export async function getGiftCards(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetGiftCardsParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${giftCardPath}`,
		'get',
		undefined,
		params
	);
}

export async function getGiftCard(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	gift_card_id: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${giftCardPath}/${gift_card_id}`,
		'get'
	);
}

export async function updateGiftCard(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	gift_card_id: string,
	request: UpdateGiftCardRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${giftCardPath}/${gift_card_id}`,
		'patch',
		request,
		undefined,
		socket_id
	);
}

export async function addGiftCard(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddGiftCardRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${giftCardPath}`,
		'post',
		request,
		undefined,
		socket_id
	);
}

export async function deleteGiftCard(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	gift_card_id: string,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${giftCardPath}/${gift_card_id}`,
		'delete',
		undefined,
		undefined,
		socket_id
	);
}
