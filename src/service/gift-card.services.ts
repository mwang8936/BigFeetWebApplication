import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import { giftCardPath } from '../constants/api.constants';

import { GetGiftCardsParam } from '../models/params/Gift-Card.Param';

import {
	AddGiftCardRequest,
	UpdateGiftCardRequest,
} from '../models/requests/GIft-Card.Request';

export async function getGiftCards(
	navigate: NavigateFunction,
	params?: GetGiftCardsParam
) {
	return authorizedRequest(
		navigate,
		`${giftCardPath}`,
		'get',
		undefined,
		params
	);
}

export async function getGiftCard(
	navigate: NavigateFunction,
	gift_card_id: string
) {
	return authorizedRequest(navigate, `${giftCardPath}/${gift_card_id}`, 'get');
}

export async function updateGiftCard(
	navigate: NavigateFunction,
	gift_card_id: string,
	request: UpdateGiftCardRequest
) {
	return authorizedRequest(
		navigate,
		`${giftCardPath}/${gift_card_id}`,
		'patch',
		request
	);
}

export async function addGiftCard(
	navigate: NavigateFunction,
	request: AddGiftCardRequest
) {
	return authorizedRequest(navigate, `${giftCardPath}`, 'post', request);
}

export async function deleteGiftCard(
	navigate: NavigateFunction,
	gift_card_id: string
) {
	return authorizedRequest(
		navigate,
		`${giftCardPath}/${gift_card_id}`,
		'delete'
	);
}
