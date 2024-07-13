import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import { GetReservationsParam } from '../models/params/Reservation.Param';
import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../models/requests/Reservation.Request.Model';

import { reservationPath } from '../constants/api.constants';

export async function getReservations(
	navigate: NavigateFunction,
	params: GetReservationsParam
) {
	return authorizedRequest(
		navigate,
		`${reservationPath}`,
		'get',
		undefined,
		params
	);
}

export async function getReservation(
	navigate: NavigateFunction,
	reservation_id: number
) {
	return authorizedRequest(
		navigate,
		`${reservationPath}/${reservation_id}`,
		'get'
	);
}

export async function updateReservation(
	navigate: NavigateFunction,
	reservation_id: number,
	request: UpdateReservationRequest
) {
	return authorizedRequest(
		navigate,
		`${reservationPath}/${reservation_id}`,
		'patch',
		request
	);
}

export async function addReservation(
	navigate: NavigateFunction,
	request: AddReservationRequest
) {
	return authorizedRequest(navigate, `${reservationPath}`, 'post', request);
}

export async function deleteReservation(
	navigate: NavigateFunction,
	reservation_id: number
) {
	return authorizedRequest(
		navigate,
		`${reservationPath}/${reservation_id}`,
		'delete'
	);
}
