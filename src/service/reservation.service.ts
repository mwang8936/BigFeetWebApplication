import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { reservationPath } from '../constants/api.constants';

import { GetReservationsParam } from '../models/params/Reservation.Param';

import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../models/requests/Reservation.Request.Model';

export async function getReservations(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetReservationsParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${reservationPath}`,
		'get',
		undefined,
		params
	);
}

export async function getReservation(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	reservation_id: number
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${reservationPath}/${reservation_id}`,
		'get'
	);
}

export async function updateReservation(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	reservation_id: number,
	request: UpdateReservationRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${reservationPath}/${reservation_id}`,
		'patch',
		request,
		undefined,
		socket_id
	);
}

export async function addReservation(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddReservationRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${reservationPath}`,
		'post',
		request,
		undefined,
		socket_id
	);
}

export async function deleteReservation(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	reservation_id: number,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${reservationPath}/${reservation_id}`,
		'delete',
		undefined,
		undefined,
		socket_id
	);
}
